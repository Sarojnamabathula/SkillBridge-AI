import logging
from typing import List, Dict, Optional
from app.config.settings import settings

logger = logging.getLogger(__name__)

class AIProviderInterface:
    def is_available(self) -> bool:
        raise NotImplementedError

    def enhance_explanation(self, skill_name: str, career_name: str, current_level: str, required_level: str) -> str:
        raise NotImplementedError

    def generate_roadmap_narrative(self, career_name: str, readiness_percentage: float) -> str:
        raise NotImplementedError


class FallbackTemplateAIProvider(AIProviderInterface):
    """Deterministic fallback provider using rules and templates."""
    def is_available(self) -> bool:
        return False

    def enhance_explanation(self, skill_name: str, career_name: str, current_level: str, required_level: str) -> str:
        if current_level == "None":
            return f"Building skills in {skill_name} is essential to establish foundational competencies required for a {career_name} role."
        else:
            return f"Advancing {skill_name} from {current_level} to {required_level} will significantly strengthen your readiness for {career_name} tasks."

    def generate_roadmap_narrative(self, career_name: str, readiness_percentage: float) -> str:
        if readiness_percentage >= 70:
            return f"You possess strong existing foundations for a career as a {career_name}. Your personalized roadmap focuses on filling specific technical gaps and building advanced portfolio artifacts."
        elif readiness_percentage >= 40:
            return f"You have solid initial progress toward becoming a {career_name}. Focus your weekly learning hours on Phase 1 & Phase 2 core skills to unlock advanced applications."
        else:
            return f"Starting your journey toward becoming a {career_name} begins with establishing clear core prerequisites. Follow the structured sequence below step-by-step."


class AIService:
    def __init__(self):
        self.fallback = FallbackTemplateAIProvider()
        self.provider_name = settings.AI_PROVIDER.lower() if settings.AI_PROVIDER else "none"
        self.api_key = settings.AI_API_KEY
        
        # Check if external AI provider is configured
        self.active_provider = self._init_provider()

    def _init_provider(self) -> AIProviderInterface:
        if self.provider_name in ("none", "") or not self.api_key:
            return self.fallback
        
        # External providers can be connected here (e.g. OpenAI / Anthropic / Gemini SDKs)
        # If SDK is missing or fails, default to fallback.
        try:
            # For prototype safety, return fallback if key is placeholder or invalid
            if "sk-" not in self.api_key and len(self.api_key) < 10:
                return self.fallback
            return self.fallback
        except Exception as e:
            logger.warning(f"Failed to initialize AI Provider {self.provider_name}: {e}. Defaulting to Fallback.")
            return self.fallback

    def is_ai_active(self) -> bool:
        return self.active_provider.is_available()

    def enhance_explanation(self, skill_name: str, career_name: str, current_level: str, required_level: str) -> str:
        try:
            return self.active_provider.enhance_explanation(skill_name, career_name, current_level, required_level)
        except Exception:
            return self.fallback.enhance_explanation(skill_name, career_name, current_level, required_level)

    def generate_roadmap_narrative(self, career_name: str, readiness_percentage: float) -> str:
        try:
            return self.active_provider.generate_roadmap_narrative(career_name, readiness_percentage)
        except Exception:
            return self.fallback.generate_roadmap_narrative(career_name, readiness_percentage)

ai_service = AIService()
