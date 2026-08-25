package main

import (
	"unsafe"
)

const (
	WIDTH  int32 = 1000
	HEIGHT int32 = 800
	SIZE   int32 = WIDTH * HEIGHT * 4
)

type Position struct {
	X int32
	Y int32
}

type Velocity struct {
	X float64
	Y float64
}

type Color struct {
	R byte
	G byte
	B byte
	A byte
}

var buffer [SIZE]byte
var ballPosition = Position{WIDTH / 2, HEIGHT / 4}
var ballSize int32 = 25

var velocity = Velocity{100, 0}
var gravity float64 = 980.0 // pixels per second squared

var backgroundColor = Color{100, 100, 100, 255}
var boxColor = Color{255, 0, 0, 255}

func main() {}

//export getBufferPointer
func getBufferPointer() uintptr {
	return uintptr(unsafe.Pointer(&buffer))
}

func getIndex(x int32, y int32) int32 {
	return (y*WIDTH + x) * 4
}

//export updateAndRender
func updateAndRender(timeDelta float64) {
	for i := 0; i < int(SIZE); i += 4 {
		buffer[i] = backgroundColor.R
		buffer[i+1] = backgroundColor.G
		buffer[i+2] = backgroundColor.B
		buffer[i+3] = backgroundColor.A
	}

	for y := max(0, ballPosition.Y-ballSize); y < min(ballPosition.Y+ballSize, HEIGHT); y++ {
		for x := max(0, ballPosition.X-ballSize); x < min(ballPosition.X+ballSize, WIDTH); x++ {
			dx := float64(x - ballPosition.X)
			dy := float64(y - ballPosition.Y)
			if (dx*dx + dy*dy) <= float64(ballSize*ballSize) {
				i := getIndex(x, y)
				buffer[i] = boxColor.R
				buffer[i+1] = boxColor.G
				buffer[i+2] = boxColor.B
				buffer[i+3] = boxColor.A
			}
		}
	}
	velocity.X += 0 * timeDelta
	ballPosition.X += int32(velocity.X * timeDelta)

	if ballPosition.X+ballSize >= WIDTH {
		velocity.X *= -0.99
		ballPosition.X = WIDTH - ballSize
	}
	if ballPosition.X-ballSize <= 0 {
		velocity.X *= -0.99
		ballPosition.X = ballSize
	}

	velocity.Y += gravity * timeDelta
	ballPosition.Y += int32(velocity.Y * timeDelta)

	if ballPosition.Y+ballSize >= HEIGHT {
		velocity.Y *= -0.99
		ballPosition.Y = HEIGHT - ballSize
	}
}
