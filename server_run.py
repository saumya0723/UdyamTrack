import os
import uvicorn

if __name__ == "__main__":
    print("=" * 70)
    print("  UdyamTrack-AI-Powered Longitudinal Outcome & Omnichannel Impact Measurement System")
    print("  Government Evaluator Demo Prototype (MSDE, India)")
    print("=" * 70)
    print("  Web Portal URL:  http://127.0.0.1:8000")
    print("  API Docs (Swagger): http://127.0.0.1:8000/docs")
    print("  Demo Logins:")
    print("    - Admin:            admin / admin123")
    print("    - Training Provider: provider / provider123")
    print("    - Employer:         employer / employer123")
    print("=" * 70)
    uvicorn.run(
    "backend.main:app",
    host="0.0.0.0",
    port=int(os.environ.get("PORT", 8000))
    )
