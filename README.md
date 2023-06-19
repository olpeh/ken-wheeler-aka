# ken-wheeler-aka

What are Ken Wheeler's display names on Twitter?

## Excuse me, what?

Just a silly side project for collecting [Ken Wheelers](https://twitter.com/ken_wheeler/) display names on Twitter and displaying them on a simple web site.

## But why?

Just for fun and for learning:

- First time using the Twitter API for reading information
- My first ever "real" application written in [Elm](http://elm-lang.org/)
- Testing how deploying small prototypes using [Beaker Browser](https://beakerbrowser.com/) works

## Check it out!

https://ken-wheeler-aka.vercel.app/

## How does it work?

There is a small backend application running in Heroku, which polls the Twitter API for ken_wheelers name.
The names are then stored into a database and the api provides them to the UI.
The UI is built using Elm, and it is based on [create-elm-app](https://github.com/halfzebra/create-elm-app)

## Development

Install dependencies: `yarn`

Start the backend: `npm start`

Deploy the backend: `fly deploy` (Fly.io)

Start the frontend: `npm run dev`

Build the frontend: `npm run build`

Deploy the frontend: `git push` (Vercel)

## Acknowledgements

- The elm app is heavily inspired by [elm-quicks](https://github.com/ohanhi/elm-quicks/) by [ohanhi](https://github.com/ohanhi/)
- This project is sponsored by [Futurice's](https://futurice.com/) [Open Source Sponsorship program](http://spiceprogram.org/oss-sponsorship)
