from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Trainee
from backend.schemas import AIPredictRequest, AIPredictResponse
from backend.ai_engine import ai_predictor, nlp_analyzer

router = APIRouter(prefix="/analytics", tags=["AI Predictive Modeling & NLP Analytics"])

@router.post("/predict-attrition", response_model=AIPredictResponse)
def predict_attrition_risk(payload: AIPredictRequest):
    """
    Evaluates attrition risk probability using the trained Logistic Regression model.
    Returns explainable risk factors and actionable remedial suggestions.
    """
    result = ai_predictor.predict(
        course=payload.course,
        district=payload.district,
        baseline_wage=payload.baseline_wage,
        age=payload.age,
        gender=payload.gender,
        current_milestone=payload.current_milestone
    )
    return result

@router.get("/attrition-nlp")
def get_attrition_nlp_analysis(db: Session = Depends(get_db)):
    """
    Extracts open-ended attrition survey responses, runs frequency tokenization,
    thematic clustering, and generates policy insights.
    """
    attrited_trainees = db.query(Trainee).filter(Trainee.attrition_reason != None).all()
    feedback_texts = [
        f"{t.attrition_reason} in {t.district} after {t.course} training"
        for t in attrited_trainees
    ]

    analysis = nlp_analyzer.analyze_feedback(feedback_texts)
    return analysis
