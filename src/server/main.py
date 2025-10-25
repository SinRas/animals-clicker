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

# example request body (only one animal can be clicked once at a time)
# {
# 	"cat":1,
# 	"dog":0,
# 	"rabbit":0
# }
@app.post("/click")
def click_post():
    data = request.json
    isValid, animal_clicked = tryGetAnimalClicked(data)
    if not isValid:
        return click_get()
    with Session(engine) as session:
        stmt = select(AnimalClick).where(AnimalClick.animal==animal_clicked)
        row = session.scalars(stmt).first()
        row.count += 1
        session.commit()

    return click_get()

@app.get("/click")
def click_get():
    with Session(engine) as session:
        stmt = select(AnimalClick).where(AnimalClick.animal.in_(animal_list))
        rows = session.scalars(stmt).all()
        result = { r.animal: r.count for r in rows}
    return json.dumps(result)

# Check if request body has valid data (only one animal with one click)
# invalid body example:
# {
# 	"cat":1,
# 	"dog":1,
# 	"rabbit":0
# }
# valid body example:
# {
# 	"cat":1,
# 	"dog":0,
# 	"rabbit":0
#   "snake":1 # this will be ignored
# }
def tryGetAnimalClicked(data: dict) -> tuple[bool, str]:
    hasClick = False
    animal_clicked = ""
    for animal_name in animal_list:
        if (data.get(animal_name) == 1):
            if (hasClick):
                return (False, animal_clicked)
            hasClick = True
            animal_clicked = animal_name
    return (hasClick, animal_clicked)

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