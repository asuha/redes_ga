# File Visualizer

File visualizer displays the content of a file sent through a web socket.

## Server

Reads a local file using node.js readFile. The file is then stored as a Buffer. Starts a node http server. Attach the web socket functionalities to the server.

## Client

Creates a web socket with the created server. Asks for the file. Renders the file content in the screen.

## Starting the Application
1. Install the dependencies (NPM or Yarn & Node.js)
2. Start the back-end server.
```sh
$ cd server
$ node server.js
```
3. Start the client server in a new prompt.
```sh
$ cd client
$ node server.js
```
4. Open the [Application](localhost:9000) in the informed port.