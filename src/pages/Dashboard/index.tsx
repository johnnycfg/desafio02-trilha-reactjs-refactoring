import { useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { useEffect } from 'react';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

export function Dashboard() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food>({
    "id": 2,
    "name": "Veggie",
    "description": "Macarrão com pimentão, ervilha e ervas finas colhidas no himalaia.",
    "price": 1.99,
    "available": true,
    "image": "https://storage.googleapis.com/golden-wind/bootcamp-gostack/desafio-food/food2.png"
  });

  useEffect(() => {
    async function getFoods() {
      const response = await api.get<Food[]>('/foods');
      setFoods(response.data);
    }

    getFoods();
  }, []);

  async function handleAddFood(food: Food) {
    try {
      const response = await api.post<Food>('/foods', {
        ...food,
        available: true
      });

      setFoods([
        ...foods,
        response.data
      ]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood (food: Food) {
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated)
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen( !modalOpen );
  }

  function toggleEditModal() {
    setEditModalOpen( !editModalOpen );
  }

  function handleEditFood(food: Food) {
    setEditingFood( food );
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
