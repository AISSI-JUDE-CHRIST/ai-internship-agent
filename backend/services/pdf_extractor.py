"""
PDF Text Extraction Service
"""
import os
from typing import Optional
from pathlib import Path
import PyPDF2
import pdfplumber
from loguru import logger


class PDFExtractor:
    """Service for extracting text from PDF files"""
    
    def __init__(self):
        """Initialize PDF extractor"""
        pass
    
    def extract_text(self, pdf_path: str, method: str = "pdfplumber") -> str:
        """
        Extract text from PDF file
        
        Args:
            pdf_path: Path to PDF file
            method: Extraction method ("pdfplumber" or "pypdf2")
            
        Returns:
            Extracted text content
        """
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
        
        try:
            if method == "pdfplumber":
                return self._extract_with_pdfplumber(pdf_path)
            else:
                return self._extract_with_pypdf2(pdf_path)
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            # Fallback to alternative method
            if method == "pdfplumber":
                return self._extract_with_pypdf2(pdf_path)
            else:
                return self._extract_with_pdfplumber(pdf_path)
    
    def _extract_with_pdfplumber(self, pdf_path: str) -> str:
        """
        Extract text using pdfplumber (better for complex layouts)
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            Extracted text content
        """
        text_parts = []
        
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
        
        return "\n\n".join(text_parts)
    
    def _extract_with_pypdf2(self, pdf_path: str) -> str:
        """
        Extract text using PyPDF2 (fallback method)
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            Extracted text content
        """
        text_parts = []
        
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)
        
        return "\n\n".join(text_parts)
    
    def extract_text_from_bytes(self, pdf_bytes: bytes, method: str = "pdfplumber") -> str:
        """
        Extract text from PDF bytes
        
        Args:
            pdf_bytes: PDF file content as bytes
            method: Extraction method
            
        Returns:
            Extracted text content
        """
        import tempfile
        
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            tmp_file.write(pdf_bytes)
            tmp_path = tmp_file.name
        
        try:
            return self.extract_text(tmp_path, method)
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)

