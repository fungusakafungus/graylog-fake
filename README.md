This thing is supposed to listen for UDP Gelf messages, store them in memory in a bounded collection and show them in a semblance of graylog web interface.

For use as graylog fake/somewhat centralized logging in development. Might be useful with docker.

#### development

React part:

```
$ nvm use
$ npm i
$ npm start
```

Go to http://localhost:8080

Python part:

Needs at least python3.4 for the `asyncio` stuff.
```
$ mkvirtualenv -p python3 graylog-fake
$ pip install -r requirements.txt
$ python gelfserver.py
```

Go to http://localhost:3000
