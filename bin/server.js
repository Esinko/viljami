/* Require */
const express = require("express")

/* Memory */
const _memory = {
    user: {
        id: null,
        token: null
    }
}

/* Declaration */
const local = express()

local.post("/set")