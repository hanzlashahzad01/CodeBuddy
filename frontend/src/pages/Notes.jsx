import React, { useEffect, useState } from 'react';
import { Download, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await axios.get('/api/notes');
        if (data.success) {
          setNotes(data.data);
        }
      } catch (err) {
        console.error('Error fetching notes:', err.message);
      }
      setLoading(false);
    };
    fetchNotes();
  }, []);

  const handleDownload = (fileUrl) => {
    const downloadUrl = fileUrl.startsWith('/') ? `http://localhost:5000${fileUrl}` : fileUrl;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-[var(--bg)]">
      <Link to="/" className="inline-flex items-center gap-2 text-[var(--color-primary)] font-bold hover:opacity-80 transition-opacity mb-8">
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </Link>

      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-[var(--color-text-main)] mb-4">Download PDF & ZIP Notes</h1>
        <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto">Get instant access to our hand-coded cheat sheets and detailed learning guides to speed up your coding journey.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {notes.map(note => (
            <div key={note._id} className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 flex flex-col h-full group">
              
              {/* Thumbnail Container */}
              <div className="aspect-[16/9] w-full bg-slate-800 relative flex items-center justify-center overflow-hidden border-b border-[var(--color-border)] p-4">
                {note.thumbnailUrl ? (
                  <img 
                    src={note.thumbnailUrl.startsWith('http') ? note.thumbnailUrl : note.thumbnailUrl} 
                    alt={note.title} 
                    className="h-2/3 max-w-[80%] object-contain group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { e.target.src = '/no-thumbnail.jpg' }}
                  />
                ) : (
                  <FileText className="w-16 h-16 text-white/50" />
                )}
                
                {/* Format badge */}
                <span className="absolute top-4 right-4 bg-black/75 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {note.format || 'ZIP'}
                </span>
              </div>

              {/* Content */}
              <div className="p-7 flex-grow flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-text-main)] mb-3 leading-tight line-clamp-1">{note.title}</h2>
                  <p className="text-[var(--color-text-muted)] text-sm mb-6 line-clamp-3 leading-relaxed">{note.description}</p>
                </div>

                <div>
                  <div className="flex justify-between items-center text-sm font-semibold text-[var(--color-text-muted)] mb-5 pt-4 border-t border-[var(--color-border)]">
                    <span>File size: <strong className="text-[var(--color-text-main)]">{note.size || 'ZIP'}</strong></span>
                    <span>Downloads: <strong className="text-[var(--color-text-main)]">{note.downloads || 0}</strong></span>
                  </div>

                  <button 
                    onClick={() => handleDownload(note.fileUrl)}
                    className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-color-primary-hover)] hover:opacity-90 text-white py-3.5 px-4 rounded-xl font-bold text-lg transition-all shadow-md cursor-pointer"
                  >
                    <Download className="w-5 h-5" /> Download Now
                  </button>
                </div>
              </div>

            </div>
          ))}
          {notes.length === 0 && (
            <div className="col-span-full text-center py-10 text-[var(--color-text-muted)] font-semibold">
              No notes available at the moment. Check back later!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notes;
