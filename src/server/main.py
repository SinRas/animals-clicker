from flask import Flask
from flask import request
import json
import sqlalchemy
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, Mapped, DeclarativeBase, mapped_column

app = Flask(__name__)
animal_list = ["dog", "cat", "rabbit"]

def initialize_rows():
    engine = create_engine("sqlite://", echo=True)
    with Session(engine) as session:
        for animal_name in animal_list:
            if (not(select(AnimalClick).where(AnimalClick.animal==animal_name))):
                animal = AnimalClick(
                    animal = animal_name,
                    count = 0
                )
                session.add_all(animal)
        print(session.query(AnimalClick).count())
    print("sth")
        # select(AnimalClick).where(AnimalClick.animal.in_(animal_list))

@app.post("/click")
def click_post():
    data = request.json
    engine = create_engine("sqlite://", echo=True)

    with Session(engine) as session:
        for animal_name in animal_list:
            #session.query(AnimalClick).filter
            print(animal_name)
            animal_click = select(AnimalClick).where(AnimalClick.animal==animal_name)
            animal_click.count += data.get(animal_name)
            session.commit()

    return str(data.get("dog"))

@app.get("/click")
def click_get():
    with Session(engine) as session:
        animal_click = select(AnimalClick).where(AnimalClick.animal.in_(animal_list))


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