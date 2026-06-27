import React, { useState } from 'react';
import './ContractorsList.css';

// Моковые данные контрагентов
const contractors = [
  { id: 1, shortName: 'ООО "Маркет"', fullName: 'Общество с ограниченной ответственностью "Маркет"', inn: '1234567890', kpp: '123456789' },
  { id: 2, shortName: 'ООО "Плюс"', fullName: 'Общество с ограниченной ответственностью "Плюс"', inn: '2345678901', kpp: '234567890' },
  { id: 3, shortName: 'ООО "Графика"', fullName: 'Общество с ограниченной ответственностью "Графика"', inn: '3456789012', kpp: '345678901' },
  { id: 4, shortName: 'ОАО "Салют"', fullName: 'Открытое акционерное общество "Салют"', inn: '4567890123', kpp: '456789012' },
  { id: 5, shortName: 'ЗАО "Вектор"', fullName: 'Закрытое акционерное общество "Вектор"', inn: '5678901234', kpp: '567890123' },
];

export default function ContractorsList() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newContractor, setNewContractor] = useState({
    shortName: '',
    fullName: '',
    inn: '',
    kpp: ''
  });

  const filtered = contractors.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      c.shortName.toLowerCase().includes(q) ||
      c.fullName.toLowerCase().includes(q) ||
      c.inn.includes(q)
    );
  });

  const handleAddContractor = (e) => {
    e.preventDefault();
    // TODO: добавить запрос к бэку
    alert(`Добавлен контрагент:\n${newContractor.shortName}`);
    setShowModal(false);
    setNewContractor({ shortName: '', fullName: '', inn: '', kpp: '' });
  };

  return (
    <div className="contractors-page">
      {/* Заголовок страницы + кнопка */}
      <div className="contractors-page__title-row">
        <h1 className="contractors-page__title">Справочник контрагентов</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Добавить контрагента
        </button>
      </div>

      {/* Поле поиска */}
      <input
        type="text"
        className="search-input"
        placeholder="Поиск по названию"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Таблица */}
      {filtered.length === 0 ? (
        <div className="empty-state">Ничего не найдено</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>№ Контрагента</th>
              <th>Название</th>
              <th>Полное название</th>
              <th>ИНН</th>
              <th>КПП</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((contractor) => (
              <tr key={contractor.id}>
                <td>{contractor.id}</td>
                <td>{contractor.shortName}</td>
                <td>{contractor.fullName}</td>
                <td>{contractor.inn}</td>
                <td>{contractor.kpp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Модальное окно добавления */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal__title">Добавить контрагента</h2>
            <form onSubmit={handleAddContractor} className="modal__form">
              <div className="field">
                <label htmlFor="shortName">Название</label>
                <input
                  id="shortName"
                  type="text"
                  placeholder="Краткое название"
                  value={newContractor.shortName}
                  onChange={(e) => setNewContractor({ ...newContractor, shortName: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="fullName">Полное название</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Полное юридическое название"
                  value={newContractor.fullName}
                  onChange={(e) => setNewContractor({ ...newContractor, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="inn">ИНН</label>
                <input
                  id="inn"
                  type="text"
                  placeholder="10 или 12 цифр"
                  value={newContractor.inn}
                  onChange={(e) => setNewContractor({ ...newContractor, inn: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="kpp">КПП</label>
                <input
                  id="kpp"
                  type="text"
                  placeholder="9 цифр"
                  value={newContractor.kpp}
                  onChange={(e) => setNewContractor({ ...newContractor, kpp: e.target.value })}
                  required
                />
              </div>
              <div className="modal__actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Отмена
                </button>
                <button type="submit" className="btn btn-primary">
                  Добавить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}