import { useEffect, useState } from 'react';

const AddFlaskModal = ({ open, onClose, onCreate }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !saving) onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, saving, onClose]);

  useEffect(() => {
    if (open) {
      setUrl('');
      setTitle('');
      setNotes('');
      setError('');
      setSaving(false);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const trimmedUrl = url.trim();
    const trimmedTitle = title.trim();
    const trimmedNotes = notes.trim();

    try {
      new URL(trimmedUrl);
    } catch {
      setError('Enter a valid article URL.');
      return;
    }

    if (!trimmedTitle) {
      setError('Add a title for the flask.');
      return;
    }

    setSaving(true);

    try {
      await onCreate({
        url: trimmedUrl,
        title: trimmedTitle,
        notes: trimmedNotes,
        progress: 0,
        pinned: false,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Could not save flask.');
      setSaving(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="add-flask-title">
        <div className="modal-header">
          <h2 id="add-flask-title">Capture an abandoned article</h2>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close add flask modal"
          >
            ×
          </button>
        </div>

        <form className="add-flask-form" onSubmit={handleSubmit} noValidate>
          <label>
            Article URL
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://example.com/article"
              autoFocus
              disabled={saving}
            />
          </label>

          <label>
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What were you reading?"
              disabled={saving}
            />
          </label>

          <label>
            Notes
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Why did you stop? What mattered?"
              rows={4}
              disabled={saving}
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? 'Bottling…' : 'Add flask'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFlaskModal;