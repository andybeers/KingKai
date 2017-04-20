package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/shirou/gopsutil/cpu"
	"github.com/shirou/gopsutil/disk"
	"github.com/shirou/gopsutil/host"
	"github.com/shirou/gopsutil/mem"
)

const (
	report_cadence            = 5
	clear_stuck_token_cadence = 1
)

var (
	kai_host string
	host_id  string
)

func collectHostStat() *host.InfoStat {
	infoStat, _ := host.Info()
	host_id = infoStat.HostID
	return infoStat
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
	Info *host.InfoStat
}
type MemoryStats struct {
	Virtual *mem.VirtualMemoryStat `json:"virtual"`
	Swap    *mem.SwapMemoryStat    `json:"swap"`
}

type StatsCollection struct {
	CPUS    []cpu.TimesStat `json:"cpus"`
	MEM     *MemoryStats    `json:"memory"`
	DISK    *DiskStats      `json: "disk"`
	HOST_ID string
}

func collectStats(token chan struct{}) {
	// configure which stats are sent based on
	// kai file
	done := make(chan struct{}, 3)
	cpuResults := collectCPUStat(done)
	memResults := collectMEMStat(done)
	diskResults := collectDiskStat(done)
	statsCollection := StatsCollection{
		HOST_ID: host_id,
	}

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
	stats_url := kai_host + "/stats"
	req, err := http.NewRequest("POST", stats_url, bytes.NewBuffer(stats_json))
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

type HandShake struct {
	HostInfo        *host.InfoStat `json: "host_info"`
	HandshakeSecret string         `json: "handshake_secret"`
}

func kingKaiHandShake() {
	fmt.Println("hand shake with the king")
	host_stats := collectHostStat()
	handshake_secret := getHandShakeSecret()

	handshake := HandShake{
		HostInfo:        host_stats,
		HandshakeSecret: handshake_secret,
	}

	handshake_payload, err := json.Marshal(handshake)
	fmt.Println(string(handshake_payload))

	handshake_url := kai_host + "/handshake"
	req, err := http.NewRequest("POST", handshake_url, bytes.NewBuffer(handshake_payload))
	if err != nil {
		log.Printf("Error making request to king kai %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{}
	resp, err := client.Do(req)
	if !(resp.StatusCode == 200) {
		// TODO: raise appropriate error
		fmt.Printf("Response code: %d", resp.StatusCode)
		os.Exit(1)
	}
	if err != nil {
		// TODO: should find a way to log this probably
		fmt.Printf("shit there was an error %v", err)
		return
	}

	fmt.Println("response status:", resp.Status)
}

func getHandShakeSecret() string {
	// TODO get secret from kai file or ENV
	return "john_wuz_here"
}

func main() {
	// parse kai file to load settings
	// for now we'll just fake it

	// this is global variable
	kai_host = "http://127.0.0.1:9091"

	// exits if not successful
	kingKaiHandShake()

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
