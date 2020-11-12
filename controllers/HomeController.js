let categorias = [
  {
    nome: "Lanches",
    codigo: 1,
    items: [
      {
        id: 1,
        nome: "x-python",
        valor: "15,99",
        imagem: "./images/food1.jpg"
      },
      {
        id: 2,
        nome: "x-C++",
        valor: "14,99",
        imagem: "./images/food2.jpg"
      },
      {
        id: 3,
        nome: "x-C#",
        valor: "14,89",
        imagem: "./images/food3.jpg"
      },
      {
        id: 4,
        nome: "x-Javascript",
        valor: "13,89",
        imagem: "./images/food3.jpg"
      },
      {
        id: 5,
        nome: "x-Go Lang",
        valor: "10,59",
        imagem: "./images/food1.jpg"
      },
      {
        id: 6,
        nome: "x-dart",
        valor: "16,59",
        imagem: "./images/food2.jpg"
      }
    ]
  },
  {
    nome: "Pizzas",
    codigo: 2,
    items: [
      {
        id: 21,
        nome: "Moda do Java",
        valor: "45,99",
        imagem: "./images/food1.jpg"
      },
      {
        id: 22,
        nome: "Pyzza",
        valor: "44,99",
        imagem: "./images/food2.jpg"
      },
      {
        id: 23,
        nome: "C# à italiana",
        valor: "44,89",
        imagem: "./images/food3.jpg"
      },
      {
        id: 24,
        nome: "Dartguesa",
        valor: "43,89",
        imagem: "./images/food3.jpg"
      },
      {
        id: 25,
        nome: "Go Lang ",
        valor: "40,59",
        imagem: "./images/food1.jpg"
      },
    ]
  },
  {
    nome: "Bebidas",
    codigo: 3,
    items: [
      {
        id: 31,
        nome: "Coca-Cola",
        valor: "108,99",
        imagem: "./images/food1.jpg"
      },
      {
        id: 32,
        nome: "Fanta",
        valor: "8,99",
        imagem: "./images/food2.jpg"
      },
      {
        id: 33,
        nome: "Sprite",
        valor: "8,89",
        imagem: "./images/food3.jpg"
      },
      {
        id: 34,
        nome: "Sukita",
        valor: "8,89",
        imagem: "./images/food3.jpg"
      },
      {
        id: 35,
        nome: "Guaraná Antártica",
        valor: "7,59",
        imagem: "./images/food1.jpg"
      },
      {
        id: 36,
        nome: "Funada",
        valor: "5,59",
        imagem: "./images/food2.jpg"
      }
    ]
  },
]

let destaques = [
  {
    id: 1,
    imagem: "./images/food1.jpg"
  },
  {
    id: 2,
    imagem: "./images/food2.jpg"
  },
  {
    id: 3,
    imagem: "./images/food3.jpg"
  },
]

module.exports = {
  index: (req,res)=>{
    res.render('index', { title: 'Ecommerce', categorias, destaques });
  },
  categorias
} 