import './Page.css';

const MOCK_USER = {
  name: 'Иван Петров',
  email: 'ivan@example.com',
  role: 'Основной владелец',
  createdAt: '12.01.2026'
};

export function AccountPage() {
  return (
    <section className="page page-wide">
      <header className="page-header-row">
        <div>
          <h1 className="page-title">Аккаунт</h1>
          <p className="page-text">
            Профиль, безопасность и доступ к облачной инфраструктуре.
          </p>
        </div>
        <div className="page-header-actions">
          <button type="button" className="page-btn page-btn-outline">
            Выйти
          </button>
        </div>
      </header>

      <div className="page-grid">
        <section className="page-card">
          <h2 className="page-card-title">Профиль</h2>
          <p className="page-card-text">
            Эти данные используются в счетах и уведомлениях.
          </p>
          <dl className="page-description-list">
            <div className="page-description-row">
              <dt>Имя</dt>
              <dd>{MOCK_USER.name}</dd>
            </div>
            <div className="page-description-row">
              <dt>Email</dt>
              <dd>{MOCK_USER.email}</dd>
            </div>
            <div className="page-description-row">
              <dt>Роль</dt>
              <dd>{MOCK_USER.role}</dd>
            </div>
            <div className="page-description-row">
              <dt>В IaaS с</dt>
              <dd>{MOCK_USER.createdAt}</dd>
            </div>
          </dl>
          <button type="button" className="page-btn page-btn-ghost">
            Редактировать профиль
          </button>
        </section>

        <section className="page-card">
          <h2 className="page-card-title">Безопасность</h2>
          <p className="page-card-text">
            Рекомендуем включить двухфакторную аутентификацию и использовать SSH‑ключи.
          </p>
          <ul className="page-list">
            <li className="page-list-item">
              <div>
                <div className="page-list-primary">Пароль</div>
                <div className="page-list-secondary">Последнее изменение: 03.02.2026</div>
              </div>
              <button type="button" className="page-link">
                Изменить
              </button>
            </li>
            <li className="page-list-item">
              <div>
                <div className="page-list-primary">Двухфакторная аутентификация</div>
                <div className="page-list-secondary">Отключена</div>
              </div>
              <button type="button" className="page-link">
                Включить
              </button>
            </li>
            <li className="page-list-item">
              <div>
                <div className="page-list-primary">SSH‑ключи</div>
                <div className="page-list-secondary">2 активных ключа</div>
              </div>
              <button type="button" className="page-link">
                Открыть раздел
              </button>
            </li>
          </ul>
        </section>
      </div>

      <section className="page-card">
        <div className="page-card-header-row">
          <div>
            <h2 className="page-card-title">Команда и доступы</h2>
            <p className="page-card-text">
              Пригласите коллег, дайте им доступ к серверам и платёжным данным.
            </p>
          </div>
          <button type="button" className="page-btn page-btn-primary">
            Пригласить в команду
          </button>
        </div>

        <div className="page-table">
          <div className="page-table-header">
            <span>Участник</span>
            <span>Email</span>
            <span>Роль</span>
            <span>Статус</span>
            <span />
          </div>
          <div className="page-table-body">
            <div className="page-table-row">
              <span>Иван Петров</span>
              <span>ivan@example.com</span>
              <span>Owner</span>
              <span className="page-badge page-badge-success">Активен</span>
              <button type="button" className="page-link">
                Управлять
              </button>
            </div>
            <div className="page-table-row">
              <span>Добавить участника</span>
              <span />
              <span />
              <span className="page-badge page-badge-muted">Пока только вы</span>
              <button type="button" className="page-link">
                Пригласить
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}


