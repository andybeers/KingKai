package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/shirou/gopsutil/cpu"
)

const (
	report_cadence            = 1
	clear_stuck_token_cadence = 1
)

var (
	kai_host string
)

func collectCPUStat(wg sync.WaitGroup) <-chan []cpu.TimesStat {
	wg.Add(1)
	cpuResults := make(chan []cpu.TimesStat)
	go func() {
		timestat, _ := cpu.Times(true)
		cpuResults <- timestat
		wg.Done()
	}()
	return cpuResults
}

type StatsCollection struct {
	cpuStat []cpu.TimesStat
}

func collectStats(token chan struct{}) {
	// configure which stats are sent based on
	// kai file
	var wg sync.WaitGroup

	cpuResults := collectCPUStat(wg)
	statsCollection := StatsCollection{}

	go func() {
		wg.Wait()
	}()

	select {
	case cpuStat := <-cpuResults:
		statsCollection.cpuStat = cpuStat
		fmt.Println("Received stats!")

	}
	go sendStatsToKingKai(&statsCollection)
	// i think ok to release token now.  if we fail to send request
	// i dont think it's worth holding onto it
	<-token
}

func sendStatsToKingKai(stats *StatsCollection) {

	fmt.Println("Sending info to king kai")
	stats_json, err := json.Marshal(stats.cpuStat)
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
