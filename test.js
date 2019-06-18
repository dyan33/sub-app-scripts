const {logging}=require("./common/util")


const log1=logging("t1","./test/t1")

log1.info("t1")

const log2=logging("t2","./test/t2")

log2.info("t2")