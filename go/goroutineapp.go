package main

import (
	"fmt"
	"os"
	"sync"
	"sync/atomic"
	"time"
	"unsafe"
)

var c = make(chan uint32, 5)
var cell uint32 = 1

func valueConsumer(c <-chan uint32, wg *sync.WaitGroup) {
	defer wg.Done()
	for value := range c {
		fmt.Printf("User value: %v\n", value)
	}
	fmt.Printf("Closing consumer\n")
}

//export getCellPtr
func getCellPtr() uintptr {
	return uintptr(unsafe.Pointer(&cell))
}

func produce(c chan uint32, wg *sync.WaitGroup) {
	defer wg.Done()
	var previousCell uint32 = 0
	for {
		currentCell := atomic.LoadUint32(&cell)
		if currentCell == uint32(0) {
			break
		}
		if previousCell != currentCell {
			fmt.Printf("Value to be sent: %v\n", currentCell)
			c <- currentCell
		}
		time.Sleep(100 * time.Millisecond)
	}
	fmt.Printf("Closing producer\n")
}

func main() {
	var consumerWg sync.WaitGroup
	var producerWg sync.WaitGroup

	fmt.Printf("Start consumer\n")
	consumerWg.Add(1)
	go valueConsumer(c, &consumerWg)
	producerWg.Add(1)
	go produce(c, &producerWg)

	producerWg.Wait()
	close(c)
	consumerWg.Wait()

	fmt.Printf("Completed\n")
	os.Exit(0)
}
