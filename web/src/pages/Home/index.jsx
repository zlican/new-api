/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@douyinfe/semi-ui';
import { Link } from 'react-router-dom';
import { API, calculateModelPrice, getLobeHubIcon } from '../../helpers';
import NoticeModal from '../../components/layout/NoticeModal';

const preferredModels = [
  'claude-opus-4',
  'gpt-5',
  'codex',
  'gemini-3-pro',
  'gemini-pro',
  'deepseek',
];

const footerGroups = [
  {
    title: '产品',
    links: [
      { label: '定价', to: '/pricing' },
      { label: '文档', href: '#' },
      { label: '面板', to: '/console' },
    ],
  },
  {
    title: '公司',
    links: [
      { label: '关于', to: '/about' },
      { label: '合作伙伴', href: 'https://aiberm.com' },
      { label: '状态', href: 'https://aiberm.com' },
    ],
  },
  {
    title: '法律',
    links: [
      { label: '隐私', to: '/privacy-policy' },
      { label: '条款', to: '/user-agreement' },
      { label: '退款政策', href: 'https://aiberm.com' },
      { label: '合规使用', to: '/user-agreement' },
    ],
  },
];

const normalizeName = (name = '') => name.toLowerCase();

const pickFeaturedModels = (models) => {
  if (!Array.isArray(models) || models.length === 0) return [];

  const picked = [];
  preferredModels.forEach((keyword) => {
    const model = models.find(
      (item) =>
        !picked.includes(item) &&
        normalizeName(item.model_name).includes(keyword),
    );
    if (model) picked.push(model);
  });

  return [
    ...picked,
    ...models.filter((model) => !picked.includes(model)),
  ].slice(0, 3);
};

const formatPercent = (value) => {
  if (!Number.isFinite(value) || value >= 0) return null;
  return `${value.toFixed(1)}%`;
};

const getVendorLabel = (model) => model.vendor_name || model.vendor || 'AI';

const normalizePriceSymbol = (value) =>
  typeof value === 'string' ? value.replace(/\$/g, '￥') : value;

const Home = () => {
  const [noticeVisible, setNoticeVisible] = useState(false);
  const [featuredModels, setFeaturedModels] = useState([]);
  const [loadingModels, setLoadingModels] = useState(true);

  const displayPrice = (price) => `￥${Number(price || 0).toFixed(3)}`;

  useEffect(() => {
    const checkNoticeAndShow = async () => {
      const lastCloseDate = localStorage.getItem('notice_close_date');
      const today = new Date().toDateString();
      if (lastCloseDate === today) return;

      try {
        const res = await API.get('/api/notice');
        const { success, data } = res.data;
        if (success && data && data.trim() !== '') {
          setNoticeVisible(true);
        }
      } catch (error) {
        console.error('获取公告失败:', error);
      }
    };

    checkNoticeAndShow();
  }, []);

  useEffect(() => {
    const loadFeaturedModels = async () => {
      setLoadingModels(true);
      try {
        const res = await API.get('/api/pricing');
        const { success, data, group_ratio } = res.data;
        if (success && Array.isArray(data)) {
          const groupRatio = group_ratio || {};
          const models = pickFeaturedModels(data).map((model) => {
            const price = calculateModelPrice({
              record: model,
              selectedGroup: 'all',
              groupRatio,
              tokenUnit: 'M',
              displayPrice,
              currency: 'USD',
              quotaDisplayType: 'USD',
              precision: 3,
            });
            const discount = formatPercent(
              (price.usedGroupRatio || 1) * 100 - 100,
            );
            return { ...model, price, discount };
          });
          setFeaturedModels(models);
        }
      } catch (error) {
        console.error('加载精选模型失败:', error);
      } finally {
        setLoadingModels(false);
      }
    };

    loadFeaturedModels();
  }, []);

  const fallbackModels = useMemo(
    () => [
      {
        model_name: 'claude-opus-4-6',
        vendor_name: 'Anthropic',
        vendor_icon: 'anthropic',
        price: { inputPrice: '￥0.950', completionPrice: '￥4.750' },
        discount: '-81.0%',
      },
      {
        model_name: 'GPT-5.3 Codex',
        vendor_name: 'OpenAI',
        vendor_icon: 'openai',
        price: { inputPrice: '￥0.179', completionPrice: '￥1.435' },
        discount: '-90.0%',
      },
      {
        model_name: 'Gemini 3 Pro',
        vendor_name: 'Google',
        vendor_icon: 'gemini',
        price: { inputPrice: '￥0.460', completionPrice: '￥2.760' },
        discount: '-63.2%',
      },
    ],
    [],
  );

  const modelsToShow =
    featuredModels.length > 0 ? featuredModels : fallbackModels;

  const renderLink = (link) => {
    if (link.to) return <Link to={link.to}>{link.label}</Link>;
    return (
      <a href={link.href} target='_blank' rel='noreferrer'>
        {link.label}
      </a>
    );
  };

  return (
    <div className='cheapai-home min-h-screen'>
      <NoticeModal
        visible={noticeVisible}
        onClose={() => setNoticeVisible(false)}
      />

      <section className='cheapai-hero'>
        <div className='cheapai-hero-content'>
          <div className='cheapai-badge'>CheapAI API Platform</div>
          <h1>让所有人使用上更 Cheap 的 AI</h1>
          <p>为开发者提供有折扣的 AI API，统一接入，透明定价。</p>
        </div>
      </section>

      <section className='cheapai-models'>
        <div className='cheapai-section-title'>
          <h2>精选模型</h2>
          <Link to='/pricing'>查看更多 →</Link>
        </div>
        <div className='cheapai-model-grid'>
          {loadingModels && featuredModels.length === 0
            ? Array.from({ length: 3 }).map((_, index) => (
                <div className='cheapai-model-card' key={index}>
                  <Skeleton
                    active
                    placeholder={<Skeleton.Paragraph rows={4} />}
                  />
                </div>
              ))
            : modelsToShow.map((model) => {
                const inputPrice =
                  normalizePriceSymbol(
                    model.price?.inputPrice || model.price?.price,
                  ) || '-';
                const outputPrice =
                  normalizePriceSymbol(
                    model.price?.completionPrice || model.price?.price,
                  ) || '-';
                const vendor = getVendorLabel(model);
                return (
                  <div className='cheapai-model-card' key={model.model_name}>
                    <div className='cheapai-model-header'>
                      <div className='cheapai-model-logo'>
                        {model.vendor_icon
                          ? getLobeHubIcon(model.vendor_icon, 28)
                          : vendor.slice(0, 1)}
                      </div>
                      <div>
                        <h3>{model.model_name}</h3>
                      </div>
                    </div>
                    <div className='cheapai-price-row'>
                      <span>Input</span>
                      <strong>{inputPrice}</strong>
                      {model.discount && <em>{model.discount}</em>}
                    </div>
                    <div className='cheapai-price-row'>
                      <span>Output</span>
                      <strong>{outputPrice}</strong>
                      {model.discount && <em>{model.discount}</em>}
                    </div>
                    <div className='cheapai-token-unit'>/ 百万 tokens</div>
                  </div>
                );
              })}
        </div>
      </section>

      <footer className='cheapai-footer'>
        <div className='cheapai-footer-brand'>
          <h2>CheapAI</h2>
          <p>为开发者提供统一的 AI API 平台，透明定价。</p>
        </div>
        <div className='cheapai-footer-links'>
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3>{group.title}</h3>
              {group.links.map((link) => (
                <div key={link.label}>{renderLink(link)}</div>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Home;
