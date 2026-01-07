from app.db.session import SessionLocal
from app.models.user import User
from app.core.hashing import get_password_hash

db = SessionLocal()

existing_user = db.query(User).filter(User.username == "admin").first()

if existing_user:
    existing_user.hashed_password = get_password_hash("admin@123")
    existing_user.role = "admin"  # Ensure role is admin
    print("✅ Admin user updated with new password")
else:
    user = User(
        username="admin",
        hashed_password=get_password_hash("admin@123"),
        role="admin"
    )
    db.add(user)
    print("✅ Admin user created")

db.commit()
db.close()
