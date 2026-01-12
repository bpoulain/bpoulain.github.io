# Gists

- [Terminal | Launch a HTTP Server with Python](https://gist.github.com/bpoulain/ffe52ed360a1b166689235355e963004)
```
# start a server (on port 8000 by default)
Python3 -m http.server
# start a server (on specific port)
Python3 -m http.server 8080

# retrieve ip adress of system
ifconfig | awk '/inet\ / { print $2 }'

# list all processes that are using port 8000
lsof -i :8000

# kill PID (Process ID)
kill 11902
```

- [Js | Deep copy of an object ](https://gist.github.com/bpoulain/b0e6374280c99f0741752f92cc49328f)
```
b = JSON.parse(JSON.stringify(a));
```

- [Js | Check if a key exists in an object (returns boolean) ](https://gist.github.com/bpoulain/f4f2bd2c4cf7898dded6c3e5e1e790ad)
```
'key' in object
```

- [Js | Check if an Object is empty (return boolean)](https://gist.github.com/bpoulain/ac203510936ca790c8c559a89ed6dfbf)
```
function isEmpty(obj) {
  return Object.entries(obj).length === 0;
}
```

- [Js | extracts, for a given key, all the corresponding values from an array of objects and returns a list of those values without duplicates](https://gist.github.com/bpoulain/7cccbe66462fe7095f88a07dc34d9dbc)
```
function getUniqueValues(array, key) {
  return [...new Set(array.map(item => item[key]))];
}
``