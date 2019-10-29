import './main.css';
import { Elm } from './Main.elm';

Elm.Main.init({
  node: document.getElementById('root'),
  flags: {
    apiBaseUrl:
      process.env.ELM_APP_API_URL ||
      'https://ken-wheeler-aka.herokuapp.com/api/aka/ken_wheeler'
  }
});
