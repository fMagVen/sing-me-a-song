import { Request, Response } from "express";
import { recommendationService } from "../services/recommendationsService.js";

export async function truncate(req: Request, res: Response){
	await recommendationService.truncate();
	res.sendStatus(200);
}

export async function seed(req: Request, res: Response){
	await recommendationService.seed();
	res.sendStatus(200);
}