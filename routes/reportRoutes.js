import express, { response } from "express";
import ReportService from "../services/ReportService.js";

const router = express.Router();

router.post("/create", async (req, res) => {
	const service = new ReportService();
	const report = await service.createReport(req.body);
	res.send(report);
});

router.get("/", async (req, res) => {
	const service = new ReportService();
	const reports = await service.getAllReports();
	res.send(reports);
});

router.get("/detail", async (req, res) => {
	const id = req.query.id;
	const service = new ReportService();
	const report = await service.findReportById(id);
	res.send(report);
});

export default router;
