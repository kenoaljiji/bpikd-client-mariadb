import React from 'react';

const Donate = () => {
  const style = {
    color: '#317eac',
  };
  return (
    <section className='container donate'>
      <h2 className='pb-0 fs-1' style={style}>
        {' '}
        Donate to Bpikd
      </h2>
      <p className='pb-0 mb-1 mt-2'>
        WikiLeaks is entirely supported by the general public.
      </p>
      <p className=''>
        Your donations pay for WikiLeaks projects, staff, servers and protective
        infrastructure.
      </p>

      <div className='btn-group' role='group' aria-label='Basic example'>
        <button type='button' className='btn btn-light px-3 py-2'>
          Credit Card
        </button>
        <button type='button' className='btn btn-light px-3 py-2'>
          Paypal
        </button>
        <button type='button' className='btn btn-light px-3 py-2'>
          Bitcoin
        </button>
      </div>
      <div className='card-custom mt-3'>
        <h2
          class='card-title p-3 rounded'
          style={{ ...style, background: '#d9edf7' }}
        >
          Credit Card
        </h2>
        <div class='card mt-3 border-top-0 rounded-0'>
          <div class='card-body p-0'>
            <div className='p-3'>
              <p class='card-text font-weight-bold'>
                Global credit card donations via the Wau Holland Foundation
              </p>
              <p class='card-text '>
                Donations made via the Wau Holland Foundation are tax deductible
                in the EU.
              </p>
              <a href='#' class='btn btn-success'>
                Wau holland fondation
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className='card-custom mt-3'>
        <h2
          class='card-title p-3 rounded'
          style={{ ...style, background: '#d9edf7' }}
        >
          Paypal
        </h2>
        <div class='card mt-3 border-top-0 rounded-0'>
          <div class='card-body p-0'>
            <div className='p-3'>
              <p className='font-weight-bold'>
                Global PayPal donations via the Wau Holland Foundation
              </p>
              <p class=''>
                Donations made via the Wau Holland Foundation are tax deductible
                in the EU.
              </p>
              <a href='#' class='btn btn-success'>
                Wau holland fondation
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;
