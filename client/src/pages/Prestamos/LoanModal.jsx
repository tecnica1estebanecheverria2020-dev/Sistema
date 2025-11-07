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
} from 'react-icons/fi';
import CustomSelect from './CustomSelect';

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
      onScanCode = () => {}
    } = props;

    const [manualCode, setManualCode] = useState('');

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div className="modal-header-content">
              <div className="modal-icon">
                <FiPlus />
              </div>
              <div className="modal-title-section">
                <h2 className="modal-title">Registrar Préstamo</h2>
                <p className="modal-subtitle">Escanea los ítems con código QR y completa los datos del préstamo</p>
              </div>
            </div>
            <button onClick={onClose} className="modal-close">
              <FiX />
            </button>
          </div>

          <form onSubmit={onSubmit} className="modal-form">
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

              {/* Right Section - QR Scanner */}
              <div className="qr-section">
                <h3 className="section-title">
                  <FiCamera className="section-icon" />
                  Ítems Solicitados
                </h3>

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
                        <FiCamera />
                        Escáner activo
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
                        Escáner desactivado
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

            <div className="modal-actions">
              <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
              <button type="submit" className="submit-button">Registrar Préstamo</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Return modal
  const { loan, returnObservations, setReturnObservations, onClose, onConfirmReturn } = props;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-icon">
              <FiRotateCcw />
            </div>
            <div className="modal-title-section">
              <h2 className="modal-title">Registrar devolución</h2>
              <p className="modal-subtitle">Confirma la devolución del préstamo</p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close">
            <FiX />
          </button>
        </div>

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

        <div className="modal-actions">
          <button type="button" onClick={onClose} className="cancel-button">Cancelar</button>
          <button type="button" className="submit-button" onClick={onConfirmReturn}>
            Confirmar devolución
          </button>
        </div>
      </div>
    </div>
  );
}