
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Utensils, Users, Plus, Trash2, Star } from "lucide-react";

interface Ingredient {
  id: number;
  value: string;
}

interface Allergy {
  id: number;
  value: string;
}

interface DishFormProps {
  initialValues?: {
    nom: string;
    description: string;
    prix: number;
    image: string;
    temps_preparation: number;
    type_cuisine: string;
    nombre_personnes: number;
    ingredients: string[];
    allergies: string[];
    note:number;
  };

  onSubmit: (values: any) => void;
  onCancel: () => void;
  submitLabel: string;
}

const cuisineOptions = [
  "Italian",
  "Mexican",
  "Chinese",
  "Indian",
  "Japanese",
  "Thai",
  "French",
  "Mediterranean",
  "American",
  "Middle Eastern",
  "Korean",
  "Vietnamese",
  "Greek",
  "Spanish",
  "Other"
];

const DishForm = ({
                    initialValues = {
                      nom: '',
                      description: '',
                      prix: 0,
                      image: '',
                      temps_preparation: 0,
                      type_cuisine: '',
                      nombre_personnes: 1,
                      ingredients: [''],
                      allergies: [''],
                      note: 0
                    },
                    onSubmit,
                    onCancel,
                    submitLabel
                  }: DishFormProps) => {
  const [values, setValues] = useState(initialValues);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
      initialValues.ingredients?.map((ing, index) => ({ id: index + 1, value: ing })) || [{ id: 1, value: "" }]
  );
  const [allergies, setAllergies] = useState<Allergy[]>(
      initialValues.allergies?.map((allergy, index) => ({ id: index + 1, value: allergy })) || [{ id: 1, value: "" }]
  );
  const [rating, setRating] = useState(initialValues.note || 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: name === "prix" ? parseFloat(value) || 0 : value
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10) || 0;
    setValues(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleIngredientChange = (id: number, value: string) => {
    setIngredients(prev =>
        prev.map(item => (item.id === id ? { ...item, value } : item))
    );
  };

  const addIngredient = () => {
    const newId = ingredients.length > 0
        ? Math.max(...ingredients.map(item => item.id)) + 1
        : 1;
    setIngredients(prev => [...prev, { id: newId, value: "" }]);
  };

  const removeIngredient = (id: number) => {
    if (ingredients.length > 1) {
      setIngredients(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAllergyChange = (id: number, value: string) => {
    setAllergies(prev =>
        prev.map(item => (item.id === id ? { ...item, value } : item))
    );
  };

  const addAllergy = () => {
    const newId = allergies.length > 0
        ? Math.max(...allergies.map(item => item.id)) + 1
        : 1;
    setAllergies(prev => [...prev, { id: newId, value: "" }]);
  };

  const removeAllergy = (id: number) => {
    if (allergies.length > 1) {
      setAllergies(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...values,
      ingredients: ingredients.map(item => item.value).filter(Boolean).join(', '),  // Transformation en chaîne
      allergies: allergies.map(item => item.value).filter(Boolean).join(', '), // Transformation en chaîne
      note: rating
    };
    onSubmit(formData);
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="dishName">Dish Name</Label>
          <Input
              id="dishName"
              name="nom"
              value={values.nom}
              onChange={handleChange}
              placeholder="e.g., Homemade Lasagna"
              required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dishDescription">Description</Label>
          <Textarea
              id="dishDescription"
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Describe your dish..."
              rows={3}
              required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dishPrice">Price ($)</Label>
            <Input
                id="dishPrice"
                name="prix"
                type="number"
                min="0.01"
                step="0.01"
                value={values.prix}
                onChange={handleChange}
                placeholder="15.99"
                required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prepTime">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Preparation Time (minutes)</span>
              </div>
            </Label>
            <Input
                id="prepTime"
                name="temps_preparation"
                type="number"
                min="1"
                value={values.temps_preparation}
                onChange={handleNumberChange}
                placeholder="30"
                required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type_cuisine">
              <div className="flex items-center gap-2">
                <Utensils className="h-4 w-4 text-muted-foreground" />
                <span>Cuisine Type</span>
              </div>
            </Label>
            <Select
                name="type_cuisine"
                value={values.type_cuisine}
                onValueChange={(value) => handleSelectChange(value, "type_cuisine")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cuisine" />
              </SelectTrigger>
              <SelectContent>
                {cuisineOptions.map((cuisine) => (
                    <SelectItem key={cuisine} value={cuisine}>
                      {cuisine}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="servings">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Number of Servings</span>
              </div>
            </Label>
            <Input
                id="servings"
                name="nombre_personnes"
                type="number"
                min="1"
                value={values.nombre_personnes}
                onChange={handleNumberChange}
                placeholder="2"
                required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ingredients</Label>
          {ingredients.map((ingredient) => (
              <div key={ingredient.id} className="flex items-center gap-2">
                <Input
                    value={ingredient.value}
                    onChange={(e) => handleIngredientChange(ingredient.id, e.target.value)}
                    placeholder="Enter ingredient"
                    className="flex-1"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeIngredient(ingredient.id)}
                    disabled={ingredients.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
          ))}
          <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addIngredient}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Ingredient
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Allergies</Label>
          {allergies.map((allergy) => (
              <div key={allergy.id} className="flex items-center gap-2">
                <Input
                    value={allergy.value}
                    onChange={(e) => handleAllergyChange(allergy.id, e.target.value)}
                    placeholder="Enter allergy"
                    className="flex-1"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeAllergy(allergy.id)}
                    disabled={allergies.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
          ))}
          <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addAllergy}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Allergy
          </Button>
        </div>

        <div className="space-y-2">
          <Label>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span>Dish Rating</span>
            </div>
          </Label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                >
                  <Star
                      className={`h-6 w-6 ${
                          star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                  />
                </button>
            ))}
            {rating > 0 && (
                <span className="ml-2 text-sm text-muted-foreground">({rating}/5)</span>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dishImage">Image URL</Label>
          <Input
              id="dishImage"
              name="image"
              type="url"
              value={values.image}
              onChange={handleChange}
              placeholder="http://example.com/image.jpg"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{submitLabel}</Button>
        </DialogFooter>
      </form>
  );
};

export default DishForm;