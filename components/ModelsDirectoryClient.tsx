'use client';

import { useState, useMemo } from 'react';
import { HfModel, formatMetric, getFriendlyTaskLabel } from '@/lib/huggingface';
import ModelRunModal from '@/components/ModelRunModal';

interface ModelsDirectoryClientProps {
  initialModels: HfModel[];
}

export default function ModelsDirectoryClient({ initialModels }: ModelsDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'trending' | 'downloads' | 'likes' | 'recent'>('trending');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedRunModel, setSelectedRunModel] = useState<HfModel | null>(null);
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);

  const groups = [
    { id: 'all', name: 'All Tasks', icon: '🌐' },
    { id: 'llm', name: 'Text & LLMs', icon: '🧠' },
    { id: 'vision', name: 'Computer Vision', icon: '👁️' },
    { id: 'audio', name: 'Audio & Speech', icon: '🎙️' },
    { id: 'code', name: 'Code & Dev', icon: '💻' },
    { id: 'nlp', name: 'NLP & Language', icon: '📚' },
  ];

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current));
    }, 2000);
  };

  const filteredAndSortedModels = useMemo(() => {
    return initialModels
      .filter((model) => {
        const { group } = getFriendlyTaskLabel(model.pipeline_tag);
        const matchesGroup = selectedGroup === 'all' || group === selectedGroup;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          q === '' ||
          model.id.toLowerCase().includes(q) ||
          (model.author && model.author.toLowerCase().includes(q)) ||
          model.tags.some((t) => t.toLowerCase().includes(q));

        return matchesGroup && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'downloads') {
          return b.downloads - a.downloads;
        }
        if (sortBy === 'likes') {
          return b.likes - a.likes;
        }
        if (sortBy === 'recent') {
          const dateA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
          const dateB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
          return dateB - dateA;
        }
        // Default / trending preservation
        return 0;
      });
  }, [initialModels, searchQuery, selectedGroup, sortBy]);

  // Aggregate stats
  const totalDownloads = useMemo(() => {
    return initialModels.reduce((acc, m) => acc + (m.downloads || 0), 0);
  }, [initialModels]);

  const totalLikes = useMemo(() => {
    return initialModels.reduce((acc, m) => acc + (m.likes || 0), 0);
  }, [initialModels]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-4)' }}>
      {/* Live Sync Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-6)',
          marginBottom: 'var(--space-8)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF9D00 0%, #FFD000 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              boxShadow: '0 4px 12px rgba(255, 157, 0, 0.25)',
            }}
          >
            🤗
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                Live Hugging Face Open-Source Radar
              </span>
              <span
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  color: '#22c55e',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'inline-block',
                  }}
                />
                Hourly Sync
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Real-time monitoring of trending weights, checkpoints, downloads, and community favorites.
            </p>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatMetric(totalDownloads)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Tracked Downloads
            </div>
          </div>
          <div style={{ width: '1px', height: '28px', background: 'var(--border-card)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {formatMetric(totalLikes)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Community Likes
            </div>
          </div>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
        }}
      >
        {/* Search Input */}
        <div style={{ flex: '1 1 320px', position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              fontSize: '0.95rem',
            }}
          >
            🔍
          </span>
          <input
            type="text"
            placeholder="Search by model name, organization (e.g. meta, deepseek), or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '11px 14px 11px 40px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-card)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-card)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="trending">🔥 Trending Momentum</option>
            <option value="downloads">📥 Most Downloads</option>
            <option value="likes">❤️ Most Liked</option>
            <option value="recent">🕒 Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Task Filters Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          scrollbarWidth: 'none',
        }}
      >
        {groups.map((group) => {
          const isActive = selectedGroup === group.id;
          return (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--border-card)',
                background: isActive ? 'var(--color-primary)' : 'var(--bg-secondary)',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{group.icon}</span>
              <span>{group.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Results Count */}
      <div
        style={{
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>
          Showing <strong>{filteredAndSortedModels.length}</strong> open-source models
        </span>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGroup('all');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-primary)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Models Grid */}
      {filteredAndSortedModels.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: 'var(--space-12) var(--space-4)',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--border-card)',
          }}
        >
          <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🔎</span>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No open-source models found
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 16px' }}>
            We could not find any models matching &ldquo;{searchQuery}&rdquo;. Try another keyword or switch task category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedGroup('all');
            }}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            View All Models
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 'var(--space-6)',
          }}
        >
          {filteredAndSortedModels.map((model) => {
            const friendly = getFriendlyTaskLabel(model.pipeline_tag);
            const isCopied = copiedId === model.id;

            return (
              <div
                key={model.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-card)',
                  borderRadius: 'var(--radius-xl)',
                  padding: 'var(--space-6)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 'var(--space-4)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
                  position: 'relative',
                }}
              >
                <div>
                  {/* Header: Author + Task Badge */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: 'var(--text-secondary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'rgba(99, 102, 241, 0.2)',
                          color: 'var(--color-primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          fontWeight: 700,
                        }}
                      >
                        {model.author ? model.author.charAt(0).toUpperCase() : 'M'}
                      </span>
                      {model.author || 'community'}
                    </span>

                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: 'var(--color-primary)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                      }}
                    >
                      {friendly.label}
                    </span>
                  </div>

                  {/* Model ID / Name */}
                  <h3
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      margin: '0 0 10px',
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                    }}
                  >
                    {model.id}
                  </h3>

                  {/* Tags */}
                  {model.tags && model.tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                      {model.tags
                        .filter((t) => !t.startsWith('license:') && !t.startsWith('region:'))
                        .slice(0, 4)
                        .map((tag) => (
                          <span
                            key={tag}
                            style={{
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'var(--bg-tertiary, rgba(255, 255, 255, 0.04))',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--border-card)',
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                <div>
                  {/* Metrics Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '10px 12px',
                      background: 'var(--bg-tertiary, rgba(255, 255, 255, 0.02))',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '14px',
                      border: '1px solid var(--border-card)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.85rem' }}>📥</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {formatMetric(model.downloads)}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Downloads</div>
                      </div>
                    </div>

                    <div style={{ width: '1px', height: '20px', background: 'var(--border-card)' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.85rem' }}>❤️</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {formatMetric(model.likes)}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Likes</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Run Code, Copy ID & External Link */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => {
                        setSelectedRunModel(model);
                        setIsRunModalOpen(true);
                      }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(99, 102, 241, 0.12)',
                        color: 'var(--color-primary)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease',
                      }}
                      title="Generate copy-paste code to run this model"
                    >
                      <span>⚡ Run</span>
                    </button>

                    <button
                      onClick={() => handleCopyId(model.id)}
                      style={{
                        flex: '1',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-md)',
                        background: isCopied ? 'rgba(34, 197, 94, 0.15)' : 'var(--bg-secondary)',
                        color: isCopied ? '#22c55e' : 'var(--text-primary)',
                        border: isCopied ? '1px solid #22c55e' : '1px solid var(--border-card)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        transition: 'all 0.15s ease',
                      }}
                      title="Copy model identifier to clipboard"
                    >
                      <span>{isCopied ? '✓' : '📋'}</span>
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <a
                      href={`https://huggingface.co/${model.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-primary)',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>HF</span>
                      <span style={{ fontSize: '0.75rem' }}>↗</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Run / Deployment Modal */}
      <ModelRunModal
        model={selectedRunModel}
        isOpen={isRunModalOpen}
        onClose={() => {
          setIsRunModalOpen(false);
          setSelectedRunModel(null);
        }}
      />
    </div>
  );
}

