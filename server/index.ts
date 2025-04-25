import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors"; 

const app = express();
const port =process.env.PORT || 5000;
 

app.use(
    cors({
        origin: ["http://localhost:3000"], 
		methods: ["GET", "POST", "PUT", "DELETE"], 
		credentials: true,
		
	})
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("i am working")
})
 
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});