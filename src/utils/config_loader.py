"""
Configuration loader utility
"""
import yaml
import os
from typing import Dict, Any


def load_config(config_path: str = "config.yaml") -> Dict[str, Any]:
    """
    Load configuration from YAML file
    
    Args:
        config_path: Path to configuration file
        
    Returns:
        Dictionary containing configuration
    """
    if not os.path.exists(config_path):
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
    
    with open(config_path, 'r', encoding='utf-8') as f:
        config = yaml.safe_load(f)
    
    return config


def load_env_vars() -> Dict[str, str]:
    """
    Load environment variables
    
    Returns:
        Dictionary of environment variables
    """
    from dotenv import load_dotenv
    load_dotenv()
    
    return {
        'OPENAI_API_KEY': os.getenv('OPENAI_API_KEY', ''),
        'LINKEDIN_EMAIL': os.getenv('LINKEDIN_EMAIL', ''),
        'LINKEDIN_PASSWORD': os.getenv('LINKEDIN_PASSWORD', ''),
    }

