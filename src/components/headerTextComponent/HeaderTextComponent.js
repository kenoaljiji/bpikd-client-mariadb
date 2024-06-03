import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useRouteContext } from '../../context/route/RouteProvider';
import './headerTextComponent.scss';
import Ticker from 'infobae-react-ticker';

const HeaderTextComponent = () => {
  const { state, getTextSettings } = useRouteContext();
  const { textTrack } = state;

  const location = useLocation();

  useEffect(() => {
    getTextSettings();
  }, []);

  if (textTrack.active && location.pathname === '/') {
    return (
      <div
        style={{
          background: '#9a0404',
          width: '100%',
          fontWeight: '500',
          textAlign: 'center',
          color: '#fff',
          padding: '6px',
          overflow: 'hidden',
        }}
      >
        {textTrack.isPlaying ? (
          <Ticker speed={5} move={textTrack.isPlaying}>
            {() => (
              <div style={{ whiteSpace: 'nowrap', marginRight: '50px' }}>
                {textTrack.text}{' '}
              </div>
            )}
          </Ticker>
        ) : (
          <div style={{ textAlign: 'center' }}>{textTrack.text} </div>
        )}
      </div>
    );
  }

  return null; // Return null or a fallback UI for when conditions are not met
};

export default HeaderTextComponent;
