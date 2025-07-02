import requests
import json

BASE_URL = "http://localhost:8000"

def test_backend():
    try:
        response = requests.get(f"{BASE_URL}/docs")
    except requests.exceptions.ConnectionError:
        return False
    
    user_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/", json=user_data)
        if response.status_code == 201:
            user = response.json()
        else:
            return False
    except Exception as e:
        return False
    
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/token", json=login_data)
        if response.status_code == 200:
            token_data = response.json()
            token = token_data["access_token"]
        else:
            return False
    except Exception as e:
        return False
    
    post_data = {
        "title": "Test Post",
        "content": "This is a test post content."
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{BASE_URL}/posts/", json=post_data, headers=headers)
        if response.status_code == 201:
            post = response.json()
            post_id = post["id"]
        else:
            return False
    except Exception as e:
        return False
    
    try:
        response = requests.get(f"{BASE_URL}/posts/")
        if response.status_code == 200:
            posts = response.json()
        else:
            return False
    except Exception as e:
        return False
    
    try:
        response = requests.get(f"{BASE_URL}/posts/{post_id}")
        if response.status_code == 200:
            post = response.json()
        else:
            return False
    except Exception as e:
        return False
    
    update_data = {
        "title": "Updated Test Post",
        "content": "This is an updated test post content."
    }
    
    try:
        response = requests.put(f"{BASE_URL}/posts/{post_id}", json=update_data, headers=headers)
        if response.status_code == 200:
            pass
        else:
            return False
    except Exception as e:
        return False
    
    try:
        response = requests.delete(f"{BASE_URL}/posts/{post_id}", headers=headers)
        if response.status_code == 204:
            pass
        else:
            return False
    except Exception as e:
        return False
    
    return True

if __name__ == "__main__":
    test_backend() 