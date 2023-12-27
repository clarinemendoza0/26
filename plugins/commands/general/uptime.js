import os from 'os';
const config = {
    name: "uptime",
    aliases: ["upt","online","onl"],
    credits: "ndt22w"
}
function onCall({ message }) {
    let time = process.uptime(),
        hours = Math.floor(time / (60 * 60)),
            minutes = Math.floor((time % (60 * 60)) / 60),
                seconds = Math.floor(time % 60);
    let platform = os.platform();
    let arch = os.arch();
    let cpu_model = os.cpus()[0].model;
    let core = os.cpus().length;
    let speed = os.cpus()[0].speed;
    let byte_fm = os.freemem();
    let byte_tm = os.totalmem();
    let gb_fm = (byte_fm / (1024 * 1024 * 1024)).toFixed(2);
    let gb_tm = (byte_tm / (1024 * 1024 * 1024)).toFixed(2);
    let u_mem = ((byte_tm - byte_fm) / (1024 * 1024 * 1024)).toFixed(2);
  let uptime = global.msToHMS(process.uptime() * 1000);
  let timeStart = Date.now(); 
    message.send('').catch(_ => {
        let timeEnd = Date.now();
        message.reply(`𖢨 · Time worked: ${hours}:${minutes}:${seconds}.\n𖢨 · Prefix default: ${global.config.PREFIX}\n𖢨 · System information:\n  - Operating system: ${platform}\n  - Arch style: ${arch}\n  - CPU: ${core} core(s) - ${cpu_model} - ${speed}MHz\n  - Free space: ${gb_fm}GB (Used ${u_mem}GB on total ${gb_tm}GB)\n𖢨 · Ping: ${Date.now() - timeStart}ms`);
    })
}




export default {
    config,
    onCall
}