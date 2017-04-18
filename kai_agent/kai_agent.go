package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/host"
	"github.com/shirou/gopsutil/mem"
)

const (
	report_cadence            = 1
	clear_stuck_token_cadence = 1
)

var (
	kai_host string
)

func collectHostStat(done chan struct{}) <-chan *HostStats {
	hostResults := make(chan *HostStats)
	go func() {
		infoStat, _ := host.Info()
		hostResults <- &HostStats{
			Info: infoStat,
		}
		done <- struct{}{}
	}()
	return hostResults
}

func collectDiskStat(done chan struct{}) <-chan *DiskStats {
	diskResults := make(chan *DiskStats)
	go func() {
		d_usage, _ := disk.Usage("/")
		diskResults <- &DiskStats{
			Usage: d_usage,
		}
		done <- struct{}{}
	}()
	return diskResults
}

func collectCPUStat(done chan struct{}) <-chan []cpu.TimesStat {
	cpuResults := make(chan []cpu.TimesStat)
	go func() {
		timestat, _ := cpu.Times(true)
		cpuResults <- timestat
		done <- struct{}{}
	}()
	return cpuResults
}

func collectMEMStat(done chan struct{}) <-chan *MemoryStats {
	memResults := make(chan *MemoryStats)
	go func() {
		vmstat, _ := mem.VirtualMemory()
		swapstat, _ := mem.SwapMemory()

		memResults <- &MemoryStats{
			Virtual: vmstat,
			Swap:    swapstat,
		}
		done <- struct{}{}
	}()
	return memResults
}

type DiskStats struct {
	Usage *disk.UsageStat `json: "usage"`
}
type HostStats struct {
	Info *host.InfoStat `json:"info"`
}
type MemoryStats struct {
	Virtual *mem.VirtualMemoryStat `json:"virtual"`
	Swap    *mem.SwapMemoryStat    `json:"swap"`
}

type StatsCollection struct {
	CPUS []cpu.TimesStat `json:"cpus"`
	MEM  *MemoryStats    `json:"memory"`
	DISK *DiskStats      `json: "disk"`
}

func collectStats(token chan struct{}) {
	// configure which stats are sent based on
	// kai file
	done := make(chan struct{}, 3)
	cpuResults := collectCPUStat(done)
	memResults := collectMEMStat(done)
	diskResults := collectDiskStat(done)
	statsCollection := StatsCollection{}

	for n := 3; n > 0; {
		select {
		case cpuStat, _ := <-cpuResults:
			statsCollection.CPUS = cpuStat
		case memStat, _ := <-memResults:
			statsCollection.MEM = memStat
		case diskStat, _ := <-diskResults:
			statsCollection.DISK = diskStat
		case <-done:
			n--
		}
	}

	go sendStatsToKingKai(statsCollection)
	// i think ok to release token now.  if we fail to send request
	// i dont think it's worth holding onto it
	<-token
}

func sendStatsToKingKai(stats StatsCollection) {

	fmt.Println("Sending info to king kai")
	stats_json, err := json.Marshal(stats)
	if err != nil {
		log.Printf("Error converting stats to json %v", err)
	}
	fmt.Println(string(stats_json))
	req, err := http.NewRequest("POST", kai_host, bytes.NewBuffer(stats_json))
	if err != nil {
		log.Printf("Error making request to king kai %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		// TODO: should find a way to log this probably
		fmt.Printf("shit there was an error %v", err)
		return
	}

	defer resp.Body.Close()
	fmt.Println("response status:", resp.Status)
}

func main() {
	// parse kai file to load settings
	// for now we'll just fake it

	// TODO: do some sort of initial sync / handshake with king kai server
	// can send extra information at that time that doesnt need to be sent
	// along with every json payload

	kai_host = "http://127.0.0.1:9091/stats"
	ticker := time.NewTicker(time.Second * report_cadence).C
	token := make(chan struct{}, 1)
	for {
		select {
		case <-ticker:
			// try to enforce 1 go routine at a time
			// not sure if this could cause overlapping
			// goroutines... case below meant to clear
			// this case if blocked waiting for token
			token <- struct{}{}
			go collectStats(token)
		case <-time.After(time.Millisecond * clear_stuck_token_cadence):
			// here to clear above case if waiting on token
			// havent decided what cadence makes sense yet
			// i figure should be the maximum amount of time
			// im willing to let collectStats execute for
		}

	}

}
