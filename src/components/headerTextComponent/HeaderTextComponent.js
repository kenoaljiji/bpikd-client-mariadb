import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRouteContext } from '../../context/route/RouteProvider';
import './headerTextComponent.scss';

const HeaderTextComponent = () => {
  const { state, getTextSettings } = useRouteContext();
  const { textTrack } = state;

  const location = useLocation();

  useEffect(() => {
    getTextSettings();
  }, []);

  const textStyle = {
    background: '#9a0404',
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'block',
    animation: textTrack.isPlaying ? 'marquee 25s linear infinite' : 'none',
  };
  if (textTrack.active && location.pathname === '/')
    return (
      <div
        style={{
          background: '#9a0404',
          width: '100%',
          fontWeight: '500',
          textAlign: 'center',
          color: '#fff',
          padding: '6px',
        }}
      >
        <span style={textStyle}>{textTrack.text}</span>
      </div>
    );
};

export default HeaderTextComponent;
