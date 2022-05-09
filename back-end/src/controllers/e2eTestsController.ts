import { Request, Response } from "express";
import { recommendationService } from "../services/recommendationsService.js";

export async function truncate(req: Request, res: Response){
	await recommendationService.truncate();
	res.sendStatus(200);
}