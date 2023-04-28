## How to play?

In this game, your task is to quickly determine the status of each black group (*dead*, *alive* or *unsettled*) and click the corresponding label.

You start with 1 minute on the clock, and gain 1 additional second for each position you classify correctly.

If you answer quickly, you will gradually get harder problems, which give you more points.

A single incorrect answer will end your run (and then your score will not update your highscore). This is to maximally discourage guessing - the only runs that count are those without mistakes.

## What does dead, alive and unsettled mean?

A black group is *alive* if black can live with some of the black stones, no matter who plays first, and without having to ignore any ko threats that white makes.

A black group is *dead* if white can kill all the black stones, no matter who plays first, and without having to ignore any ko threats that black makes.

If a group is neither dead or alive, it's *unsettled*. Whether it lives or dies depends on who plays first and/or who has more ko threats.

We ignore the existence of unremovable ko threats, as the situations where an unremovable ko threat affects the status of another group are quite rare. This way our definition matches the practical fact that [bent four in the corner](https://senseis.xmp.net/?BentFourInTheCorner) is usually dead.

We also ignore the possibility that the opponent has an infinite source of ko threats elsewhere on the board (for instance in a double ko seki). Double ko life counts as life, double ko death counts as death.

<!-- ## Examples

TODO add examples with explanation. -->

## Keyboard shortcuts

| Action    | Key           |
|-----------|---------------|
| Dead      | Left arrow    |
| Unsettled | Up/down arrow |
| Alive     | Right arrow   |
| New game  | Enter         |

## Practice mode

If you prefer playing without time pressure, click the timer (while it's not running) to enable practice mode. In this mode you can freely choose which difficulty level you want to be tested on, and if you make a mistake you can just try again until you get it right.

## Credits

Made with [p5.js](https://p5js.org/).

Sound effects from [lichess](https://github.com/lichess-org/lila).
