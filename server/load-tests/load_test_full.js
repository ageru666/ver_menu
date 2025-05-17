import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    menu_load: {
      executor: 'constant-arrival-rate',
      rate: 10,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 20,
      exec: 'getMenuTest',
    },
    login_users: {
      executor: 'per-vu-iterations',
      vus: 5,
      iterations: 2,
      exec: 'loginTest',
    },
    order_creation: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: 5 },
        { duration: '20s', target: 10 },
        { duration: '10s', target: 0 },
      ],
      exec: 'orderTest',
    },
    reservation_form: {
      executor: 'constant-vus',
      vus: 5,
      duration: '20s',
      exec: 'reservationTest',
    },
  },
};

// GET /api/dishes
export function getMenuTest() {
  const res = http.get('https://ver-menu-2.onrender.com/api/dishes');
  check(res, {
    'GET /dishes status is 200': (r) => r.status === 200,
    'response is not empty': (r) => r.body.length > 0,
  });
  sleep(1);
}

// POST /api/users/login
export function loginTest() {
  const payload = JSON.stringify({
    email: 'testuser@example.com',
    password: '123456',
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post('https://ver-menu-2.onrender.com/api/users/login', payload, params);
  check(res, {
    'logged in': (r) => r.status === 200,
    'received token': (r) => JSON.parse(r.body).token !== undefined,
  });
  sleep(1);
}

// POST /api/orders/create
export function orderTest() {
  const payload = JSON.stringify({
    cart: [
      { name: "Манду", price: 150, quantity: 2 }
    ],
    timeOption: "По готовності",
    orderType: "Самовивіз",
    paymentMethod: "Готівка",
    contactInfo: {
      name: "Тест",
      phone: "+38(088)888-88-88",
      email: "test@example.com"
    }
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post('https://ver-menu-2.onrender.com/api/orders/create', payload, params);
  check(res, {
    'order created': (r) => r.status === 201,
  });
  sleep(1);
}

// POST /api/reservations
export function reservationTest() {
  const payload = JSON.stringify({
    name: "Іван",
    phone: "+380991112233",
    date: new Date().toISOString(),
    time: "19:00",
    guests: 3
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post('https://ver-menu-2.onrender.com/api/reservations', payload, params);
  check(res, {
    'reservation created': (r) => r.status === 201,
    'response contains ID': (r) => JSON.parse(r.body).reservationId !== undefined,
  });
  sleep(1);
}
