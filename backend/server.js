import dotenv from "dotenv"

import {app} from './app.js'

dotenv.config();


const server = app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server running on port ${process.env.PORT || 8000}`);
})

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // optional: shut down process gracefully
    // process.exit(1)
});

export default server;