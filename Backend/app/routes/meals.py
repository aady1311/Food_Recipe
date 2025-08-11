from fastapi import APIRouter, Depends, HTTPException, status, Query
from app.auth import get_current_user
from app.models import User
import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("")
async def get_meals(
    page: int = Query(1, ge=1, description="Page number (minimum 1)"),
    limit: int = Query(10, ge=1, le=100, description="Number of items per page (1-100)"),
    current_user: User = Depends(get_current_user)
):
    """
    Get meals from external API with authentication required.
    
    - **page**: Page number (default: 1, minimum: 1)
    - **limit**: Items per page (default: 10, range: 1-100)
    
    Requires valid JWT token in Authorization header: Bearer <token>
    """
    try:
        # External API URL
        external_api_url = f"https://api.freeapi.app/api/v1/public/meals?page={page}&limit={limit}"
        
        # Make request to external API
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(external_api_url)
            
            # Check if external API request was successful
            if response.status_code != 200:
                logger.error(f"External API error: {response.status_code} - {response.text}")
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="External service unavailable"
                )
            
            # Return the response as-is from external API
            return response.json()
            
    except httpx.TimeoutException:
        logger.error("Timeout while calling external meals API")
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="External service timeout"
        )
    except httpx.RequestError as e:
        logger.error(f"Request error while calling external meals API: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="External service error"
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in get_meals: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
