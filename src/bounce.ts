export const WIDTH: number = 1000;
export const HEIGHT: number = 800;
export const SIZE: number = WIDTH * HEIGHT * 4;

interface Position {
    X: number;
    Y: number;
}

interface Velocity {
    X: number;
    Y: number;
}

interface Color {
    R: number;
    G: number;
    B: number;
    A: number;
}

export const buffer: Uint8Array = new Uint8Array(SIZE);

let ballPosition: Position = { X: Math.floor(WIDTH / 2), Y: Math.floor(HEIGHT / 4) };
let ballSize: number = 25;

let velocity: Velocity = { X: 100, Y: 0 };
let gravity: number = 980.0;

const backgroundColor: Color = { R: 100, G: 100, B: 100, A: 255 };
const boxColor: Color = { R: 255, G: 0, B: 0, A: 255 };

function getIndex(x: number, y: number): number {
    return (y * WIDTH + x) * 4;
}

export function updateAndRender(timeDelta: number): void {
    for (let i = 0; i < SIZE; i += 4) {
        buffer[i] = backgroundColor.R;
        buffer[i + 1] = backgroundColor.G;
        buffer[i + 2] = backgroundColor.B;
        buffer[i + 3] = backgroundColor.A;
    }

    const startY = Math.max(0, ballPosition.Y - ballSize);
    const endY = Math.min(ballPosition.Y + ballSize, HEIGHT);
    const startX = Math.max(0, ballPosition.X - ballSize);
    const endX = Math.min(ballPosition.X + ballSize, WIDTH);

    for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
            const dx = x - ballPosition.X;
            const dy = y - ballPosition.Y;
            
            if ((dx * dx + dy * dy) <= (ballSize + ballSize)) {
                const i = getIndex(x, y);
                buffer[i] = boxColor.R;
                buffer[i + 1] = boxColor.G;
                buffer[i + 2] = boxColor.B;
                buffer[i + 3] = boxColor.A;
            }
        }
    }

    velocity.X += 0 * timeDelta;
    ballPosition.X += Math.trunc(velocity.X * timeDelta);

    if (ballPosition.X + ballSize >= WIDTH) {
        velocity.X *= -0.99;
        ballPosition.X = WIDTH - ballSize;
    }
    if (ballPosition.X - ballSize <= 0) {
        velocity.X *= -0.99;
        ballPosition.X = ballSize;
    }

    velocity.Y += gravity * timeDelta;
    ballPosition.Y += Math.trunc(velocity.Y * timeDelta);

    if (ballPosition.Y + ballSize >= HEIGHT) {
        velocity.Y *= -0.99;
        ballPosition.Y = HEIGHT - ballSize;
    }
}
