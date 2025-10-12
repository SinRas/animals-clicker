from flask import Flask
from flask import request
import json
import sqlalchemy
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, Mapped, DeclarativeBase, mapped_column

app = Flask(__name__)
animal_list = ["dog", "cat", "rabbit"]
engine = create_engine("sqlite:///animalsclicker.db", echo=True)

def initialize_rows():
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        for animal_name in animal_list:
            stmt = select(AnimalClick).where(AnimalClick.animal==animal_name)
            if session.scalars(stmt).first() == None:
                newRow = AnimalClick(
                    animal = animal_name,
                    count = 0
                )
                session.add(newRow)
                session.commit()

# example request body
# {
# 	"cat":1,
# 	"dog":1,
# 	"rabbit":0
# }
@app.post("/click")
def click_post():
    data = request.json
    with Session(engine) as session:
        for animal_name in animal_list:
            stmt = select(AnimalClick).where(AnimalClick.animal==animal_name)
            row = session.scalars(stmt).first()
            row.count += data.get(animal_name)
            session.commit()

    return click_get()

@app.get("/click")
def click_get():
    with Session(engine) as session:
        stmt = select(AnimalClick).where(AnimalClick.animal.in_(animal_list))
        rows = session.scalars(stmt).all()
        result = { r.animal: r.count for r in rows}
    return json.dumps(result)

class Base(DeclarativeBase):
    pass

class AnimalClick(Base):
    __tablename__ = "animal_click"
    id: Mapped[int] = mapped_column(primary_key=True)
    animal: Mapped[str]
    count: Mapped[int]

    def __repr__(self) -> str:
        return f"AnimalClick (animal={self.animal}, count={self.count})"

initialize_rows()