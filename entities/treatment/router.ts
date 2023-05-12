import  express from 'express'
import {  listTreatments } from './controller.js'

const router= express.Router()

router.get('/', async(req,res,next)=>{
    try{
        res.json(await listTreatments())
    }
    catch(e){
        next(e)
    }
})

export default router