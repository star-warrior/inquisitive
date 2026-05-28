import { Router, Request, Response } from "express";
import {
  buildNotebook,
  InvalidTopicError,
  ModelExhaustedError,
  NoSearchResultsError,
  AIServiceError,
} from "../services/aiSearch.service.js";

const router = Router();

router.post("/search", async (req: Request, res: Response) => {
  try {
    const result = await buildNotebook(
      req.body.topic,
      req.body.level,
      req.body.length,
    );

    res.status(200).json({ success: true, result });
    return;
  } catch (error: any) {
    console.error("Error in AI search:", error);

    if (error instanceof InvalidTopicError) {
      res.status(400).json({
        success: false,
        errorType: "INVALID_TOPIC",
        reason: error.reason,
        message: error.message,
      });
      return;
    }
    if (error instanceof ModelExhaustedError) {
      res.status(503).json({
        success: false,
        errorType: "MODEL_EXHAUSTED",
        message: "Our AI systems are experiencing heavy traffic and models are currently exhausted. Please try again in a few moments.",
      });
      return;
    }
    if (error instanceof NoSearchResultsError) {
      res.status(422).json({
        success: false,
        errorType: "NO_SEARCH_RESULTS",
        message: "No relevant learning materials or tutorials could be found for this topic. Please try a different or more specific topic.",
      });
      return;
    }
    if (error instanceof AIServiceError) {
      res.status(502).json({
        success: false,
        errorType: "AI_SERVICE_ERROR",
        message: error.message || "An issue occurred while parsing the AI response.",
      });
      return;
    }

    res.status(500).json({
      success: false,
      errorType: "INTERNAL_SERVER_ERROR",
      message: error?.message || "An internal server error occurred during AI search.",
    });
    return;
  }
});

export default router;

