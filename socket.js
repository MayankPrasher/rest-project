let io;


module.exports = {
    init: ()=>{
        io = require('socket.io');
        return io;
    },
    getIO:()=>{

        if(!io){
            throw new Error('Socket.io not initialized !');
        }
        return io;
    }
};``