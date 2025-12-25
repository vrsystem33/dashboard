// customers.mock.data.ts
import { Customer, CustomerStatus } from './customers.service';

export function generateMockCustomers(count: number = 50): Customer[] {
  const firstNames = [
    'João', 'Maria', 'Carlos', 'Ana', 'Pedro', 'Mariana', 'Lucas', 'Juliana', 
    'Fernando', 'Patrícia', 'Ricardo', 'Amanda', 'Roberto', 'Camila', 'Diego',
    'Larissa', 'Rafael', 'Beatriz', 'Daniel', 'Gabriela', 'Marcos', 'Isabela',
    'Antônio', 'Laura', 'Eduardo', 'Letícia', 'Felipe', 'Vanessa', 'Thiago', 'Clara'
  ];

  const lastNames = [
    'Silva', 'Souza', 'Pereira', 'Oliveira', 'Santos', 'Rodrigues', 'Ferreira',
    'Almeida', 'Costa', 'Carvalho', 'Gomes', 'Martins', 'Ribeiro', 'Lima', 'Araújo',
    'Monteiro', 'Barbosa', 'Nascimento', 'Mendes', 'Moreira', 'Cardoso', 'Teixeira',
    'Cunha', 'Moura', 'Dias', 'Castro', 'Campos', 'Braga', 'Freitas', 'Rocha'
  ];

  const domains = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'empresa.com',
    'companhia.com', 'negocios.com', 'comercial.com', 'servico.com'
  ];

  const dddCodes = ['11', '21', '31', '41', '51', '61', '71', '81', '91'];

  const statusOptions: CustomerStatus[] = ['active', 'inactive'];

  const generatePhone = (): string => {
    const ddd = dddCodes[Math.floor(Math.random() * dddCodes.length)];
    const prefix = Math.floor(Math.random() * 90000 + 10000).toString();
    const suffix = Math.floor(Math.random() * 9000 + 1000).toString();
    return `(${ddd}) ${prefix}-${suffix}`;
  };

  const generateEmail = (firstName: string, lastName: string): string => {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const variants = [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
      `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}`,
      `${firstName.toLowerCase()}${Math.floor(Math.random() * 100)}`
    ];
    const username = variants[Math.floor(Math.random() * variants.length)];
    return `${username}@${domain}`;
  };

  const generateOrders = (): number => {
    // Distribuição: maioria com poucos pedidos, alguns com muitos
    const rand = Math.random();
    if (rand < 0.6) return Math.floor(Math.random() * 10); // 0-9 pedidos (60%)
    if (rand < 0.9) return Math.floor(Math.random() * 40) + 10; // 10-49 pedidos (30%)
    return Math.floor(Math.random() * 100) + 50; // 50-149 pedidos (10%)
  };

  const generateTotalSpent = (orders: number): number => {
    const avgOrderValue = Math.random() * 200 + 50; // R$ 50-250 por pedido
    const total = orders * avgOrderValue;
    return Math.round(total * 100) / 100; // Arredonda para 2 casas decimais
  };

  const generateStatus = (orders: number): CustomerStatus => {
    // Clientes com 0 pedidos têm maior chance de serem inativos
    if (orders === 0) return Math.random() < 0.7 ? 'inactive' : 'active';
    // Clientes com pedidos são majoritariamente ativos
    return Math.random() < 0.8 ? 'active' : 'inactive';
  };

  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = generateEmail(firstName, lastName);
    const phone = Math.random() < 0.9 ? generatePhone() : ''; // 10% sem telefone
    const orders = generateOrders();
    const totalSpent = generateTotalSpent(orders);
    const status = generateStatus(orders);

    customers.push({
      id: crypto.randomUUID(),
      name,
      email,
      phone,
      status,
      orders,
      totalSpent
    });
  }

  return customers;
}

// Dados de exemplo para uso imediato
export const mockCustomers: Customer[] = [
  {
    id: crypto.randomUUID(),
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    phone: '(11) 98888-0001',
    status: 'active',
    orders: 12,
    totalSpent: 1499.90
  },
  {
    id: crypto.randomUUID(),
    name: 'Maria Souza',
    email: 'maria.souza@hotmail.com',
    phone: '(21) 97777-0002',
    status: 'inactive',
    orders: 3,
    totalSpent: 299.00
  },
  {
    id: crypto.randomUUID(),
    name: 'Carlos Pereira',
    email: 'carlos.pereira@gmail.com',
    phone: '(31) 96666-0003',
    status: 'active',
    orders: 25,
    totalSpent: 3890.50
  },
  {
    id: crypto.randomUUID(),
    name: 'Ana Oliveira',
    email: 'ana.oliveira@outlook.com',
    phone: '(41) 95555-0004',
    status: 'active',
    orders: 8,
    totalSpent: 1200.75
  },
  {
    id: crypto.randomUUID(),
    name: 'Pedro Santos',
    email: 'pedro.santos@yahoo.com',
    phone: '(51) 94444-0005',
    status: 'inactive',
    orders: 1,
    totalSpent: 150.00
  },
  ...generateMockCustomers(45) // Gera mais 45 clientes aleatórios
];