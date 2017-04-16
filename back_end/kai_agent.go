package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/shirou/gopsutil/cpu"
)

const (
	report_cadence = 5
)

var (
	kai_host string
)

type CPUStat struct {
	timestat []cpu.TimesStat
	infostat []cpu.InfoStat
}

func collectCPUStat(wg sync.WaitGroup) <-chan *CPUStat {
	wg.Add(1)
	cpuResults := make(chan *CPUStat)
	go func() {
		timestat, _ := cpu.Times(true)
		infostat, _ := cpu.Info()
		cpuResults <- &CPUStat{timestat: timestat,
			infostat: infostat}
		wg.Done()
	}()
	return cpuResults
}

type StatsCollection struct {
	cpuStat *CPUStat
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
		fmt.Print("Recevied stats!")
		fmt.Print(statsCollection.cpuStat)

	}
	go sendInfoToKingKai(&statsCollection)
	// maybe pre-mature to release token
	<-token
}

func sendInfoToKingKai(stats *StatsCollection) {

	fmt.Print("Sending info to king kai")
	stats_json, err := json.Marshal(stats)
	if err != nil {
		log.Printf("Error converting stats to json %v", err)
	}
	req, err := http.NewRequest("POST", kai_host, bytes.NewBuffer(stats_json))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		// TODO: should find a way to log this probably
		fmt.Printf("shit there was an error %v", err)
	}

	defer resp.Body.Close()
	fmt.Println("response status:", resp.Status)
	fmt.Println("response headers:", resp.Header)
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("response Body:", string(body))
}

func main() {
	// parse kai file to load settings
	// for now we'll just fake it

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
		case <-time.After(time.Millisecond * 750):
			// here to clear above case if waiting on token
			// havent decided what cadence makes sense yet
			// i figure should be the maximum amount of time
			// im willing to let collectStats execute for
		}

	}

}
