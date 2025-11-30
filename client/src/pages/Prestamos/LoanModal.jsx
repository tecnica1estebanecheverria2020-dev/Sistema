import React, { useState } from 'react';
import {
  FiPlus,
  FiX,
  FiUser,
  FiCamera,
  FiBook,
  FiTrash,
  FiMinus,
  FiRotateCcw,
  FiPlus as FiPlusIcon,
  FiSave,
  FiGrid,
  FiSearch,
} from 'react-icons/fi';
import { LuBinary } from "react-icons/lu";
import CustomSelect from './CustomSelect';
import Modal from '../../shared/components/Modal/Modal';

export default function LoanModal(props) {
  const { type, isOpen } = props;
  if (!isOpen) return null;

  if (type === 'new' || type === 'create') {
    const {
      onClose,
      formData,
      setFormData,
      handleInputChange,
      professors = [],
      loadingProfessors = false,
      requestedItems = [],
      setRequestedItems,
      onSubmit,
      scannerEnabled = true,
      setScannerEnabled = () => {},
      onScanCode = () => {},
      inventoryByCode = {}
    } = props;

    const [manualCode, setManualCode] = useState('');
    const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'catalog'
    const [catalogSearch, setCatalogSearch] = useState('');

    // Convertir inventoryByCode a array para el catálogo
    const inventoryItems = Object.values(inventoryByCode);

    // Filtrar items del catálogo por búsqueda
    const filteredCatalog = inventoryItems.filter(item =>
      item.name?.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      item.code?.toLowerCase().includes(catalogSearch.toLowerCase())
    );

    const handleAddFromCatalog = (item) => {
      if (!item) return;
      onScanCode(item.code);
    };

    const footer = (
      <>
        <button type="button" onClick={onClose} className="modal-btn modal-btn-secondary">
          <FiX />
          Cancelar
        </button>
        <button type="submit" form="loan-form" className="modal-btn modal-btn-primary">
          <FiSave />
          Registrar Préstamo
        </button>
      </>
    );

    return (
      <Modal
        isOpen={true}
        onClose={onClose}
        title="Registrar Préstamo"
        icon={FiPlus}
        footer={footer}
      >
        <form id="loan-form" onSubmit={onSubmit} className="modal-form">
            <div className="form-sections">
              {/* Left Section - Form */}
              <div className="form-section">
                <h3 className="section-title">
                  <FiUser className="section-icon" />
                  Información del Préstamo
                </h3>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Profesor Autorizante</label>
                    <CustomSelect
                      value={formData.profesorAutorizante}
                      onChange={(value) => setFormData(prev => ({ ...prev, profesorAutorizante: value }))}
                      options={professors}
                      placeholder={loadingProfessors ? 'Cargando profesores...' : 'Selecciona un profesor'}
                      className="form-select"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Solicitante</label>
                    <input
                      type="text"
                      name="solicitante"
                      value={formData.solicitante}
                      onChange={handleInputChange}
                      placeholder="Nombre del alumno o persona"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Observaciones (opcional)</label>
                    <textarea
                      name="observaciones"
                      value={formData.observaciones}
                      onChange={handleInputChange}
                      placeholder="Notas adicionales sobre el préstamo"
                      className="form-textarea"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Right Section - QR Scanner / Catalog */}
              <div className="qr-section">
                <h3 className="section-title">
                  <FiBook className="section-icon" />
                  Ítems Solicitados
                </h3>

                {/* Tabs */}
                <div className="loan-tabs">
                  <button
                    type="button"
                    className={`loan-tab ${activeTab === 'scanner' ? 'active' : ''}`}
                    onClick={() => setActiveTab('scanner')}
                  >
                    <FiCamera />
                    Escanear QR
                  </button>
                  <button
                    type="button"
                    className={`loan-tab ${activeTab === 'catalog' ? 'active' : ''}`}
                    onClick={() => setActiveTab('catalog')}
                  >
                    <FiGrid />
                    Catálogo ({inventoryItems.length})
                  </button>
                </div>

                {/* Scanner Tab */}
                {activeTab === 'scanner' && (
                  <div className="qr-scanner">
                  <div className="qr-icon">
                    <div className="qr-squares">
                      <div className="qr-square"></div>
                      <div className="qr-square"></div>
                      <div className="qr-square"></div>
                      <div className="qr-square"></div>
                    </div>
                  </div>
                  <h4 className="qr-title">Escanear Código QR</h4>
                  {scannerEnabled ? (
                    <>
                      <p className="qr-description">
                        Acerca el código QR del equipo al escáner para agregarlo al préstamo
                      </p>
                      <div
                        className={`scan-button active`}
                        onClick={() => setScannerEnabled(false)}
                        title="Desactivar escáner"
                      >
                        <LuBinary size={20} />
                        Ingresar código manualmente
                      </div>
                      <p className="qr-note">
                        Si tienes un lector de barras USB, al escanear llenará automáticamente el código y se detectará.
                      </p>
                    </>
                  ) : (
                    <>
                      <div
                        className={`scan-button inactive`}
                        onClick={() => setScannerEnabled(true)}
                        title="Activar escáner"
                      >
                        <FiCamera />
                        Utilizar escáner
                      </div>
                      <div className="manual-code" style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                        <input
                          type="text"
                          value={manualCode}
                          onChange={(e) => setManualCode(e.target.value)}
                          placeholder="Ingresar código manual"
                          className="form-input"
                          style={{ flex: 1 }}
                        />
                        <button
                          type="button"
                          className="action-btn"
                          onClick={() => {
                            const code = manualCode.trim();
                            if (code) {
                              onScanCode(code);
                              setManualCode('');
                            }
                          }}
                        >
                          Agregar
                        </button>
                      </div>
                    </>
                  )}
                </div>
                )}

                {/* Catalog Tab */}
                {activeTab === 'catalog' && (
                  <div className="catalog-view">
                    <div className="catalog-search">
                      <FiSearch className="search-icon-catalog" />
                      <input
                        type="text"
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        placeholder="Buscar por nombre o código..."
                        className="catalog-search-input"
                      />
                    </div>
                    <div className="catalog-list">
                      {filteredCatalog.length === 0 ? (
                        <div className="no-catalog-items">
                          <FiBook className="no-items-icon" />
                          <p className="no-items-text">
                            {catalogSearch ? 'No se encontraron ítems' : 'No hay ítems en el catálogo'}
                          </p>
                        </div>
                      ) : (
                        filteredCatalog.map((item, index) => (
                          <div key={index} className="catalog-item">
                            <div className="catalog-item-info">
                              <span className="catalog-item-name">{item.name}</span>
                              <span className="catalog-item-code">Código: {item.code}</span>
                              <span className="catalog-item-available">
                                Disponible: {item.available || 0}/{item.amount || 0}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="catalog-add-btn"
                              onClick={() => handleAddFromCatalog(item)}
                              disabled={!item.available || item.available <= 0}
                            >
                              <FiPlusIcon />
                              Agregar
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Lista de items solicitados (común para ambos tabs) */}
                <div className="requested-items">
                  {requestedItems.length === 0 ? (
                    <div className="no-items">
                      <FiBook className="no-items-icon" />
                      <p className="no-items-text">No hay ítems agregados</p>
                      <p className="no-items-subtext">Escanea un código QR para comenzar</p>
                    </div>
                  ) : (
                    <div className="items-list">
                      {requestedItems.map((item, index) => (
                        <div key={index} className="requested-item">
                          <div className="requested-item-info">
                            <span className="item-name">{item.name}</span>
                            <span className="item-available">Disponible: {item.available}</span>
                          </div>
                          <div className="requested-item-actions">
                            <button type="button" className="qty-btn action-btn" onClick={() => props.setRequestedItems(prev => {
                              const updated = [...prev];
                              const it = updated[index];
                              updated[index] = { ...it, quantity: Math.max(1, it.quantity - 1) };
                              return updated;
                            })}><FiMinus /></button>
                            <span className="qty-value">{item.quantity}</span>
                            <button type="button" className="qty-btn action-btn" onClick={() => props.setRequestedItems(prev => {
                              const updated = [...prev];
                              const it = updated[index];
                              updated[index] = { ...it, quantity: Math.min(it.available || 1, it.quantity + 1) };
                              return updated;
                            })}><FiPlusIcon /></button>
                            <button
                              type="button"
                              onClick={() => props.setRequestedItems(prev => prev.filter((_, i) => i !== index))}
                              className="remove-item"
                              title="Eliminar"
                            >
                              <FiTrash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
      </Modal>
    );
  }

  // Return modal
  const { loan, returnObservations, setReturnObservations, onClose, onConfirmReturn } = props;

  const returnFooter = (
    <>
      <button type="button" onClick={onClose} className="modal-btn modal-btn-secondary">
        <FiX />
        Cancelar
      </button>
      <button type="button" className="modal-btn modal-btn-primary" onClick={onConfirmReturn}>
        <FiRotateCcw />
        Confirmar devolución
      </button>
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Registrar Devolución"
      icon={FiRotateCcw}
      footer={returnFooter}
    >
      <div className="form-section">
          <p><strong>Confirma la devolución de:</strong> {loan?.item}</p>
          <p><strong>Solicitante:</strong> {loan?.solicitante}</p>
          <p><strong>Cantidad:</strong> {loan?.cantidad}</p>
          <div className="form-group full-width">
            <label className="form-label">Observaciones de la devolución (opcional)</label>
            <textarea
              value={returnObservations}
              onChange={(e) => setReturnObservations(e.target.value)}
              placeholder="Notas sobre la devolución"
              className="form-textarea"
              rows="3"
            />
          </div>
        </div>
    </Modal>
  );
}