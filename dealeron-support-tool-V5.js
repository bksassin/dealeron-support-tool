
(function() {
  'use strict';

  // Only run in top window, not in iframes
  if (window.top !== window.self) {
      return; // Exit if we're in an iframe
  }

  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
#dealeron-support-button {
  position: fixed !important;
  top: -14px !important;
  left: 0px !important;
  width: 185px !important;
  height: 53px !important;
  background-color: #1e3a8a !important;
  background-image: url('https://i.postimg.cc/kg2TGY9B/SUPPORT-TOOL-Logo-1.png') !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  cursor: pointer !important;
  box-shadow: 0 6px 16px rgba(0,0,0,0.5) !important;
  z-index: 99999 !important; /* Increased from 9998 to 99999 to ensure visibility */
  transition: transform 0.3s ease, box-shadow 0.3s ease, opacity 0.5s ease !important;
  user-select: none !important;
  opacity: 0 !important;
  transform: scale(0.8) translateY(10px) !important;
}

      #dealeron-support-button.show {
          opacity: 1 !important;
          transform: scale(1) translateY(0) !important;
      }

      #dealeron-support-button:hover {
          box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;
          transform: translateY(-4px) scale(1.05) !important;
      }

      #dealeron-support-button.active {
          transform: scale(1) translateY(0) !important;
      }

      #dealeron-side-tab {
          position: fixed !important;
          top: 0px !important;
          left: 0 !important;
          width: auto !important;
          min-width: 40px !important;
          height: 40px !important;
          background-color: #1e3a8a !important;
          color: white !important;
          font-family: Arial, sans-serif !important;
          align-items: center !important;
          justify-content: center !important;
          cursor: pointer !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
          z-index: 10000 !important;
          border-radius: 0 0 4px 0 !important;
          user-select: none !important;
          display: none;
          padding: 0 !important;
      }

      #dealeron-side-tab:hover {
          background-color: #2a4caf !important;
          box-shadow: 0 3px 12px rgba(0,0,0,0.4) !important;
      }

      .dealeron-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
          font-family: Arial, sans-serif !important;
      }

      .dealeron-modal-content {
          position: relative;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          width: 60%;
          max-height: 80%;
          overflow-y: auto;
      }

      .dealeron-modal-close {
          position: absolute;
          top: 10px;
          right: 15px;
          font-size: 24px;
          font-weight: bold;
          color: #999;
          cursor: pointer;
          line-height: 1;
      }

      .dealeron-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 0 15px 0;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
      }

      .dealeron-modal-title {
          font-size: 18px;
          font-weight: bold;
          color: #1e3a8a;
          margin: 0;
          flex-grow: 1;
      }

      .dealeron-code-block {
          background-color: #f8f9fa;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 15px;
          margin: 10px 0;
          font-family: 'Courier New', monospace;
          white-space: pre-wrap;
          word-break: break-all;
          line-height: 1.5;
          font-size: 14px;
          overflow-x: auto;
          tab-size: 4;
      }

      .dealeron-copy-btn {
          background-color: #1e3a8a;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 5px 10px;
          margin-right: 10px;
          font-size: 12px;
          cursor: pointer;
          opacity: 0.8;
          transition: all 0.2s ease;
      }

      .dealeron-copy-btn:hover {
          opacity: 1;
          transform: translateY(-2px);
      }

      @keyframes menuSlideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
      }

      @keyframes submenuSlideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
      }
  `;
  document.head.appendChild(styleEl);

  // Create the DealerOn Support Tool Button
  const floatingButton = document.createElement('div');
  floatingButton.id = 'dealeron-support-button';
  floatingButton.title = 'DealerOn Support Tools';

  // Create the menu tab that appears when main button is clicked
  const sideTab = document.createElement('div');
  sideTab.id = 'dealeron-side-tab';
  sideTab.title = 'Show DealerOn Support Tools';

  // Add content to the side tab
  const sideTabContent = document.createElement('div');
  sideTabContent.style.cssText = `
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      white-space: nowrap !important;
      padding: 3px 4px !important;
  `;

  // DealerOn logo image
  const logoImg = document.createElement('img');
  logoImg.src = 'https://www.dealeron.com/wp-content/uploads/dealeron-brandmark-export.png';
  logoImg.style.cssText = `
      height: 30px !important;
      width: auto !important;
  `;

  // Add logo to the container
  sideTabContent.appendChild(logoImg);
  sideTab.appendChild(sideTabContent);

// Shared function to enable drag on modal headers, clamped to viewport
function enableDrag(modal, handle) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  // Ensure modal is fixed position so it doesn't scroll with the page
  modal.style.position = 'fixed';
  handle.style.cursor = 'move';

  const onMouseDown = (e) => {
    isDragging = true;
    const rect = modal.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;

    const modalWidth = modal.offsetWidth;
    const modalHeight = modal.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate new position
    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    // Clamp to keep modal inside viewport
    newLeft = Math.max(0, Math.min(newLeft, windowWidth - modalWidth));
    newTop = Math.max(0, Math.min(newTop, windowHeight - modalHeight));

    modal.style.left = `${newLeft}px`;
    modal.style.top = `${newTop}px`;
    modal.style.right = 'auto';
  };

  const onMouseUp = () => {
    isDragging = false;
    document.body.style.userSelect = ''; // Re-enable text selection
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  handle.addEventListener('mousedown', onMouseDown);
}



  // Create the main menu
  const menu = document.createElement('div');
  menu.id = 'dealeron-support-menu';
  menu.style.cssText = `
      position: fixed;
      top: 39px;
      background-color: #183089;
      overflow-y: auto;
      max-height: 85%;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      display: none;
      flex-direction: column;
      z-index: 10000;
      animation: menuSlideIn 0.3s ease-out forwards;
  `;

  // Create a container to hold all submenus
  const submenusContainer = document.createElement('div');
  submenusContainer.id = 'dealeron-submenus-container';
  document.body.appendChild(submenusContainer);

  // Create a container for modals
  const modalsContainer = document.createElement('div');
  modalsContainer.id = 'dealeron-modals-container';
  document.body.appendChild(modalsContainer);

// Function to create a modal with code block and copy button
function createModal(title, content, isHtml = true) {
  const modal = document.createElement('div');
  modal.className = 'dealeron-modal';
  modal.style.display = 'none';

  const modalContent = document.createElement('div');
  modalContent.className = 'dealeron-modal-content';

  // Create modal header with title and close button (X)
  const modalHeader = document.createElement('div');
  modalHeader.className = 'dealeron-modal-header';

  const modalTitle = document.createElement('div');
  modalTitle.className = 'dealeron-modal-title';
  modalTitle.textContent = title;

  // Create close button (X)
  const closeBtn = document.createElement('div');
  closeBtn.className = 'dealeron-modal-close';
  closeBtn.innerHTML = '&times;';  // This is the 'X' icon

  // Style close button
  closeBtn.style.fontSize = '30px';
  closeBtn.style.fontWeight = 'bold';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '10px';
  closeBtn.style.color = '#999';  // Default color

  // Close the modal when the 'X' is clicked
  closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
  });

  // Add hover effect for the close button (change to red)
  closeBtn.addEventListener('mouseover', () => {
      closeBtn.style.color = 'red';  // Red on hover
  });

  closeBtn.addEventListener('mouseout', () => {
      closeBtn.style.color = '#999';  // Return to default color
  });

  // Add the close button to the header
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeBtn);
  modalContent.appendChild(modalHeader);

  const modalBody = document.createElement('div');
  modalBody.className = 'dealeron-modal-body';

  // Create code block with proper formatting
  const codeBlock = document.createElement('div');
  codeBlock.className = 'dealeron-code-block';

  // Format the content with proper indentation
  let formattedContent = content;
  if (isHtml) {
      // For HTML content, ensure it's properly displayed
      formattedContent = formatHtmlForDisplay(content);
  }

  codeBlock.textContent = formattedContent;
  modalBody.appendChild(codeBlock);

  // Function to format HTML for better display
  function formatHtmlForDisplay(html) {
      return html.replace(/></g, '>\n<')
                .replace(/>\s+</g, '>\n<')
                .replace(/\s{2,}/g, ' ')
                .trim();
  }

  // Move the copy button to the bottom
  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy Code';
  copyButton.style.cssText = `
      background-color: #1e3a8a;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 10px;
      cursor: pointer;
      width: 100%;
      margin-top: 15px;
      transition: all 0.2s ease;
  `;
  copyButton.addEventListener('mouseover', () => {
      copyButton.style.backgroundColor = '#1e4cb8';
      copyButton.style.transform = 'translateY(-1px)';
      copyButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
  });
  copyButton.addEventListener('mouseout', () => {
      copyButton.style.backgroundColor = '#1e3a8a';
      copyButton.style.transform = 'translateY(0)';
      copyButton.style.boxShadow = 'none';
  });

  // Copy the content to the clipboard when the copy button is clicked
  copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(content).then(() => {
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
              copyButton.textContent = 'Copy';
          }, 2000);
      }).catch(err => {
          console.error('Could not copy text: ', err);
          copyButton.textContent = 'Failed!';
          setTimeout(() => {
              copyButton.textContent = 'Copy';
          }, 2000);
      });
  });

  modalContent.appendChild(modalBody);

  // Add the copy button at the bottom instead of the close button
  modalContent.appendChild(copyButton);

  // Add the modal to the container
  modal.appendChild(modalContent);
  modalsContainer.appendChild(modal);

  return modal;
}


  // Function to create a menu item
function createMenuItem(text, onClick, hasSubmenu = false) {
  const container = document.createElement('div'); // <- wrapper
  container.style.width = '100%';

  const item = document.createElement('button');
  item.textContent = text;
  item.dataset.hasSubmenu = hasSubmenu;

  if (onClick) item.addEventListener('click', onClick);

  item.style.cssText = `
      background-color: #e5eaf3;
      border: 1px solid #cbd5e0;

      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      color: #000;

      padding: 10px 15px;
      text-align: left;
      cursor: pointer;
      font-family: Arial, sans-serif;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s ease;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
  `;

  if (hasSubmenu) {
      const arrow = document.createElement('span');
      arrow.className = 'submenu-arrow';
      arrow.innerHTML = '▼';
      arrow.style.transition = 'transform 0.3s ease';
      arrow.style.fontSize = '10px';
      arrow.style.opacity = '0.7';
      item.appendChild(arrow);
  }

  item.addEventListener('mouseover', () => {
      item.style.backgroundColor = '#e2e8f0';
      item.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      item.style.color = '#1a365d';
  });

  item.addEventListener('mouseout', () => {
      item.style.backgroundColor = '#f0f4f8';
      item.style.boxShadow = 'none';
      item.style.color = '#000';
  });

  container.appendChild(item); // <-- button inside wrapper
  return container; // <-- return the wrapper div instead of just the button
}


// The most important part to fix is the createSubmenu function
// and how it handles opening and closing submenus

// Track all open submenus for proper management
const openSubmenus = [];

// Function to create a submenu with improved hierarchy management
function createSubmenu(parentWrapper, parentMenu) {
  const submenu = document.createElement('div');
  submenu.className = 'dealeron-submenu';
  submenu.style.cssText = `
      display: block;
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s ease, padding 0.3s ease;
      flex-direction: column;
      background-color: #eef2f7;
      margin-left: 5px;

      border-left: 1px solid #1e3a8a;
      gap: 4px;
  `;

  parentWrapper.appendChild(submenu);

  const button = parentWrapper.querySelector('button');
  const arrow = button.querySelector('.submenu-arrow');

  const submenuInfo = {
      element: submenu,
      parentItem: button,
      parentMenu: parentMenu,
      isOpen: false,
      level: parentMenu.id === 'dealeron-support-menu' ? 1 : (parseInt(parentMenu.dataset.level || '1') + 1)
  };

  submenu.dataset.level = submenuInfo.level.toString();

  button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Toggle visibility
      if (submenuInfo.isOpen) {
          submenu.style.maxHeight = '0';
          submenu.style.paddingTop = '0';
          submenu.style.paddingBottom = '0';
          submenuInfo.isOpen = false;

          if (arrow) arrow.style.transform = 'rotate(0deg)';
          openSubmenus.splice(openSubmenus.findIndex(info => info.element === submenu), 1);
      } else {
          // Close sibling submenus
          const siblingSubmenus = openSubmenus.filter(info => info.parentMenu === parentMenu);
          siblingSubmenus.forEach(info => {
              info.element.style.maxHeight = '0';
              info.element.style.paddingTop = '0';
              info.element.style.paddingBottom = '0';
              const siblingArrow = info.parentItem.querySelector('.submenu-arrow');
              if (siblingArrow) siblingArrow.style.transform = 'rotate(0deg)';
              info.isOpen = false;
          });


          submenu.style.paddingBottom = '6px';
          submenu.style.maxHeight = submenu.scrollHeight + 'px';
          submenuInfo.isOpen = true;
          if (arrow) arrow.style.transform = 'rotate(180deg)';
          openSubmenus.push(submenuInfo);
      }
  });

  document.addEventListener('click', (event) => {
      if (
          !submenu.contains(event.target) &&
          !button.contains(event.target) &&
          submenuInfo.isOpen
      ) {
          submenu.style.maxHeight = '0';
          submenu.style.paddingTop = '0';
          submenu.style.paddingBottom = '0';
          submenuInfo.isOpen = false;
          if (arrow) arrow.style.transform = 'rotate(0deg)';
          const index = openSubmenus.indexOf(submenuInfo);
          if (index !== -1) openSubmenus.splice(index, 1);
      }
  });

  return submenu;
}

  // Shared Modal
function showModal({ title, width = '90%', maxWidth = '600px', bodyBuilder, footerButtons = [] }) {
// backdrop
const modal = document.createElement('div');
Object.assign(modal.style, {
  position: 'fixed', top: 0, left: 0,
  width: '100%', height: '100%',
  backgroundColor: 'rgba(0,0,0,.5)',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  zIndex: 10000
});

// content container
const content = document.createElement('div');
Object.assign(content.style, {
  position: 'relative',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width, maxWidth, maxHeight: '80%', overflowY: 'auto',
  fontFamily: 'Arial, sans-serif'
});

  // close X
  const closeX = document.createElement('div');
  closeX.innerHTML = '&times;';
  Object.assign(closeX.style, {
      position: 'absolute',
      top: '10px',
      right: '15px',
      fontSize: '35px',
      fontWeight: 'bold',
      color: '#999',
      cursor: 'pointer',
      transition: 'color 0.2s ease'
  });

  closeX.addEventListener('click', () => document.body.removeChild(modal));

  closeX.addEventListener('mouseenter', () => {
      closeX.style.color = '#dc2626'; // Tailwind's red-600
  });

  closeX.addEventListener('mouseleave', () => {
      closeX.style.color = '#999';
  });


// header
const h3 = document.createElement('h3');
h3.textContent = title;
Object.assign(h3.style, {
  margin: '0 0 15px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px'
});

// assemble
content.appendChild(closeX);
content.appendChild(h3);
// let caller populate the body
bodyBuilder(content);

// optional footer buttons
footerButtons.forEach(btnCfg => {
  const btn = document.createElement('button');
  btn.textContent = btnCfg.text;
  Object.assign(btn.style, btnCfg.style);
  btn.addEventListener('click', () => {
    if (btnCfg.onClick) btnCfg.onClick();
    if (btnCfg.closeOnClick) document.body.removeChild(modal);
  });
  content.appendChild(btn);
});

modal.appendChild(content);
document.body.appendChild(modal);
return modal;
}

  function sharedInteractiveModal(titleText, onClose) {
const modal = document.createElement('div');
modal.className = 'dealeron-modal';
modal.style.cssText = `
  position: fixed; top: 20px; right: 20px; z-index: 10001;
  background: #fff; border-radius: 12px; box-shadow: 0 20px 30px rgba(0,0,0,0.2);
  font-family: 'Segoe UI', sans-serif; max-height: calc(100vh - 40px);
  overflow-y: auto; transition: all .3s ease-in-out;
`;
modal.setAttribute('data-ignore-inspect', 'true');

const modalContent = document.createElement('div');
modalContent.className = 'dealeron-modal-content';
modalContent.style.position = 'relative';
modalContent.style.padding = '0';
modalContent.style.width = '100%';
modalContent.style.maxWidth = '520px';
modalContent.setAttribute('data-ignore-inspect', 'true');

const modalHeader = document.createElement('div');
modalHeader.style.cssText = `
  background: #1e3a8a; color: #fff; display: flex; justify-content: space-between;
  align-items: center; padding: 12px 16px; font-size: 16px; font-weight: 600;
  border-bottom: 1px solid #ccc; cursor: move;
`;

const modalTitle = document.createElement('div');
modalTitle.textContent = titleText;

const closeBtn = document.createElement('div');
closeBtn.innerHTML = '&times;';
closeBtn.style.cssText = 'cursor: pointer; font-size: 20px; font-weight: bold;';
closeBtn.addEventListener('click', () => {
  if (typeof onClose === 'function') onClose();
  document.body.removeChild(modal);
});

modalHeader.append(modalTitle, closeBtn);
modalContent.appendChild(modalHeader);
modal.appendChild(modalContent);
document.body.appendChild(modal);

enableDrag(modal, modalHeader);
return { modal, modalContent, modalHeader };
}


      // Menu item 1: Website to CMS
  const websiteToCmsItem = createMenuItem('🔄 Website to CMS', function() {
      var a = window.DlronGlobal_DealerId || prompt("Enter Dealer ID:");
      window.open("https://cms.dealeron.com/crm/webadmin_main.asp?id=" + a);
  });
  menu.appendChild(websiteToCmsItem);

         // Menu item 2: Page to CMS
const pageToCmsItem = createMenuItem('📝 Page to CMS', function() {
  const scriptTag = document.getElementById("dealeron_tagging_data");

  if (scriptTag) {
      try {
          const jsonData = JSON.parse(scriptTag.textContent);
          const dealerId = jsonData.dealerId;
          const pageId = jsonData.pageId;

          if (dealerId && pageId) {
              window.open(`https://cms.dealeron.com/crm/webadmin_content.asp?pageid=${pageId}&dealerid=${dealerId}`, '_blank');
          } else {
              alert("Dealer ID or Page ID not found in the script.");
          }
      } catch (e) {
          alert("Failed to parse tagging data. It may be malformed.");
      }
  } else {
      alert("Script tag with ID 'dealeron_tagging_data' not found.");
  }
});
menu.appendChild(pageToCmsItem);

  // Menu item 3: Get Dealer ID
  const getDealerIdItem = createMenuItem('🔢 Get Dealer ID', function() {
      prompt("Dealer Id:", window.DlronGlobal_DealerId || "Not found on this page");
  });
  menu.appendChild(getDealerIdItem);

  // Menu item 4: Dealer ID to Website
  const dealerIdToWebsiteItem = createMenuItem('🔍 Dealer ID to Website', function() {
      var dealerID = prompt("What's The Magic #");
      if (dealerID !== null && dealerID.trim() !== '') {
          window.open("http://dealer" + dealerID + ".dealeron.com");
      }
  });
  menu.appendChild(dealerIdToWebsiteItem);

// Menu item 5: Manage AppStore
const manageAppStoreItem = createMenuItem('📱 Manage Apps', function() {
    const dealerId = window.DlronGlobal_DealerId || prompt("Enter Dealer ID:");
    if (dealerId) {
        window.open("https://apps.sincrotools.com/manage-installations?query=" + dealerId, "_blank");
    }
});
menu.appendChild(manageAppStoreItem);


// Menu item 5: Edit Price Stack
const editPriceStackItem = createMenuItem('💰 Edit Price Stack', function() {
  // Try to get the dealer ID from the global variable
  let dealerId = null;

  // First try to get the dealer ID from the global variable
  if (typeof window.DlronGlobal_DealerId !== 'undefined' && window.DlronGlobal_DealerId) {
      dealerId = window.DlronGlobal_DealerId;
  } else {
      // If not found in global variable, try to extract from URL
      const urlMatch = window.location.hostname.match(/dealer(\d+)\.dealeron\.com/i);
      if (urlMatch && urlMatch[1]) {
          dealerId = urlMatch[1];
      }
  }

  if (dealerId) {
      // Open the Price Stack editor for this dealer ID
      window.open(`https://pricing.dealeron.com/${dealerId}/new/pricestak`, '_blank');
  } else {
      // If dealer ID couldn't be found, prompt the user to enter it
      const promptedId = prompt("Enter Dealer ID for Price Stack editing:");
      if (promptedId && !isNaN(promptedId.trim())) {
          window.open(`https://pricing.dealeron.com/${promptedId.trim()}/new/pricestak`, '_blank');
      } else if (promptedId) {
          alert("Invalid Dealer ID. Please enter a numeric ID.");
      }
  }
});
menu.appendChild(editPriceStackItem);

      // Menu item 6*: VIN Diagnose - Only shows on VDPs
const vinMatch = window.location.href.match(/[A-HJ-NPR-Z0-9]{17}(?=[^A-Z0-9]|$)/i);
const vin = vinMatch ? vinMatch[0].toUpperCase() : null;

if (vin) {
  const vinDiagnoseItem = createMenuItem('🚗 VIN Diagnose', null, true);
  menu.appendChild(vinDiagnoseItem);

  // Create submenu for VIN Diagnose
  const vinSubmenu = createSubmenu(vinDiagnoseItem, menu);

  // VIN display
  const vinLabel = document.createElement('div');
  vinLabel.textContent = `VIN: ${vin}`;
  vinLabel.style.cssText = `
      color: #000;
      font-size: 13px;
      margin-bottom: 4px;
      font-family: monospace;
  `;
  vinSubmenu.appendChild(vinLabel);

  // Copy VIN button
  const copyVinBtn = document.createElement('button');
  copyVinBtn.textContent = 'Copy VIN';
  copyVinBtn.style.cssText = `
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 12px;
      cursor: pointer;
      margin-bottom: 6px;
  `;
  copyVinBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(vin);
      copyVinBtn.textContent = 'Copied!';
      setTimeout(() => copyVinBtn.textContent = 'Copy VIN', 1500);
  });
  vinSubmenu.appendChild(copyVinBtn);

  // Open VIN Diagnose link
  const openLinkBtn = document.createElement('button');
  openLinkBtn.textContent = 'VIN Diagnose';
  openLinkBtn.style.cssText = `
      background-color: #1e3a8a;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 12px;
      cursor: pointer;
  `;
openLinkBtn.addEventListener('click', () => {
    window.open(`https://cms.dealeron.com/ui/inventory/vin-diagnose#/${vin}`, '_blank');
});
  vinSubmenu.appendChild(openLinkBtn);
}


  // Menu item 6: Feature Override (parent menu)
  const featureOverrideItem = createMenuItem('⚙️ Feature Overrides', null, true);
  menu.appendChild(featureOverrideItem);

  // Create Feature Override submenu
  const featureOverrideSubmenu = createSubmenu(featureOverrideItem, menu);

  // Helper function to properly apply feature overrides
  function applyFeatureOverride(paramName, paramValue) {
      // Get the current URL and parse it
      const url = new URL(window.location.href);

      // Remove any existing feature override parameters
      url.searchParams.delete('do_all');
      url.searchParams.delete('do_tpi');
      url.searchParams.delete('do_gtm');
      url.searchParams.delete('do_cc');
      url.searchParams.delete('do_oem');
      url.searchParams.delete('do_blocks');
      url.searchParams.delete('do_gmaps');

      // Add the specific override parameter
      url.searchParams.set(paramName, paramValue);

      // Navigate to the new URL
      window.location.href = url.toString();
  }

  // Feature Override submenu items
  const turnOffAllItem = createMenuItem('Turn Off Everything', function() {
      applyFeatureOverride('do_all', 'off');
  });
  featureOverrideSubmenu.appendChild(turnOffAllItem);

  const turnOffTPIsItem = createMenuItem('Turn Off All TPIs', function() {
      applyFeatureOverride('do_tpi', 'off');
  });
  featureOverrideSubmenu.appendChild(turnOffTPIsItem);

  const turnOffGTMItem = createMenuItem('Turn Off GTM', function() {
      applyFeatureOverride('do_gtm', 'off');
  });
  featureOverrideSubmenu.appendChild(turnOffGTMItem);

  const turnOffCustomCodeItem = createMenuItem('Turn Off Custom Code', function() {
      applyFeatureOverride('do_cc', 'off');
  });
  featureOverrideSubmenu.appendChild(turnOffCustomCodeItem);

  const turnOffOEMItem = createMenuItem('Turn Off OEM Settings', function() {
      applyFeatureOverride('do_oem', 'off');
  });
  featureOverrideSubmenu.appendChild(turnOffOEMItem);

  const turnOffPageBlockItem = createMenuItem('Turn Off Page Blocks', function() {
      applyFeatureOverride('do_blocks', 'off');
  });
  featureOverrideSubmenu.appendChild(turnOffPageBlockItem);

  const turnOffGMapsItem = createMenuItem('Turn Off Google Maps', function() {
      applyFeatureOverride('do_gmaps', 'off');
  });
  featureOverrideSubmenu.appendChild(turnOffGMapsItem);

  // Menu item 7: 3rd-Party Inspector
const ctaInspectorItem = createMenuItem('🕵️ 3rd-Party Inspector', function () {
let selectedElement = null;
let isInspecting = false;
let lastHovered = null;
let showRaw = false;
let lastVendorOutput = '';
let lastRawHTML = '';

const modal = document.createElement('div');
modal.className = 'dealeron-modal';
modal.style.zIndex = '10001';
modal.setAttribute('data-ignore-inspect', 'true');

const modalContent = document.createElement('div');
modalContent.className = 'dealeron-modal-content';
modalContent.setAttribute('data-ignore-inspect', 'true');
modalContent.style.cssText = `
  width:100%;max-width:520px;position:fixed;top:20px;right:20px;
  background:#fff;border-radius:12px;box-shadow:0 20px 30px rgba(0,0,0,0.2);
  font-family:'Segoe UI',sans-serif;max-height:calc(100vh - 40px);
  overflow-y:auto;
`;

const modalHeader = document.createElement('div');
modalHeader.className = 'dealeron-modal-header';
modalHeader.style.cursor = 'move';

const modalTitle = document.createElement('div');
modalTitle.className = 'dealeron-modal-title';
modalTitle.textContent = '3rd-Party Inspector';

const closeBtn = document.createElement('div');
closeBtn.className = 'dealeron-modal-close';
closeBtn.innerHTML = '&times;';
closeBtn.addEventListener('click', () => {
  cleanupInspectMode();
  document.body.removeChild(modal);
});

modalHeader.appendChild(modalTitle);
modalHeader.appendChild(closeBtn);

const modalBody = document.createElement('div');
modalBody.style.cssText = 'padding:16px;font-size:14px;color:#333;background:#f9fafb;';

const inspectBtn = document.createElement('button');
inspectBtn.textContent = 'Inspect Element';
inspectBtn.style.cssText = `
  background:linear-gradient(to right, #16a34a, #22c55e);
  color:#fff;border:none;border-radius:6px;
  padding:12px;margin-bottom:12px;width:100%;font-weight:600;
  font-size:14px;cursor:pointer;
`;
inspectBtn.onclick = () => {
  if (!isInspecting) {
    isInspecting = true;
    inspectBtn.textContent = 'Cancel';
    document.body.style.cursor = 'crosshair';
    modal.style.pointerEvents = 'none';
    modalContent.style.pointerEvents = 'auto';
    document.addEventListener('click', elementClickHandler, true);
    document.addEventListener('mouseover', hoverHandler, true);
    document.addEventListener('mouseout', hoverOutHandler, true);
  } else {
    cleanupInspectMode();
  }
};

const instructions = document.createElement('div');
instructions.innerHTML = `
  <p><strong>How to use:</strong></p>
  <ol style="margin-left:20px;line-height:1.4;">
    <li>Click “Inspect Element” then click any CTA/popup/etc.</li>
    <li>The tool checks the html of the element selected for common 3rd-party code</li>
  </ol>
  <p>Example IDs:</p>
  <ul style="margin-left:20px;line-height:1.4;">
    <li><code>cn-</code> → CarNow</li>
    <li><code>tp-</code> → TradePending</li>
    <li><code>als-</code> → Fullpath / AutoLeadStar</li>
    <li><code>autofi-</code> → AutoFi</li>
  </ul>
  <p style="color:#c53030"><strong>Note:</strong> Always double-check in inspector, CMS, or with the vendor directly.</p>
`;
instructions.style.marginBottom = '20px';

const rawToggleBtn = document.createElement('button');
rawToggleBtn.textContent = 'View Raw HTML';
rawToggleBtn.disabled = true;
rawToggleBtn.style.cssText = `
  background:transparent;border:1px solid #1e3a8a;color:#1e3a8a;
  border-radius:4px;padding:8px;margin-bottom:8px;width:100%;
  font-size:13px;cursor:pointer;transition:background-color .2s;
`;
rawToggleBtn.style.display = 'none';
rawToggleBtn.onmouseover = () => rawToggleBtn.style.backgroundColor = '#e2e8f0';
rawToggleBtn.onmouseout = () => rawToggleBtn.style.backgroundColor = 'transparent';
rawToggleBtn.onclick = () => {
  showRaw = !showRaw;
  rawToggleBtn.textContent = showRaw ? 'View Styled Results' : 'View Raw HTML';
  updateResultBox();
};

const detectedMessage = document.createElement('div');
detectedMessage.style.cssText = 'margin-bottom:12px;';

const resultBox = document.createElement('div');
resultBox.style.cssText = `
  background:#f1f5f9;border-left:4px solid #1e3a8a;padding:12px;
  font-family:'Courier New',monospace;font-size:13px;color:#1a202c;
  border-radius:6px;box-shadow:inset 0 0 5px rgba(0,0,0,0.05);
  max-height:60vh;overflow-y:auto;overflow-x:hidden;word-break:break-word;
  margin-bottom:16px;
`;
resultBox.textContent = '';

modalBody.append(inspectBtn, instructions, rawToggleBtn, detectedMessage, resultBox);
modalContent.append(modalHeader, modalBody);
modal.appendChild(modalContent);
document.body.appendChild(modal);
enableDrag(modalContent, modalHeader);

function updateResultBox() {
  if (!lastRawHTML) return;
  resultBox.innerHTML = showRaw
    ? `
      <div style="font-weight:bold;margin-bottom:8px;">🔍 Results:</div>
      <pre style="white-space:pre-wrap;word-break:break-word;overflow-x:hidden;">
${lastRawHTML}
      </pre>
    `
    : lastVendorOutput;
}

function hoverHandler(e) {
  if (!isInspecting || e.target.closest('[data-ignore-inspect="true"]')) return;
  if (lastHovered && lastHovered !== e.target) lastHovered.style.outline = '';
  lastHovered = e.target;
  e.target.style.outline = '2px solid red';
  e.stopPropagation();
}

function hoverOutHandler(e) {
  if (!isInspecting) return;
  e.target.style.outline = '';
  e.stopPropagation();
}

function cleanupInspectMode() {
  isInspecting = false;
  inspectBtn.textContent = 'Inspect Element';
  document.body.style.cursor = '';
  document.removeEventListener('click', elementClickHandler, true);
  document.removeEventListener('mouseover', hoverHandler, true);
  document.removeEventListener('mouseout', hoverOutHandler, true);
  if (lastHovered) lastHovered.style.outline = '';
  modal.style.pointerEvents = 'auto';
}

function showToast(msg, ok = true) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `
    position:fixed;top:30px;left:50%;transform:translateX(-50%);
    background:${ok ? '#1e3a8a' : '#dc2626'};color:#fff;padding:12px 20px;
    border-radius:6px;font-size:14px;box-shadow:0 5px 15px rgba(0,0,0,0.2);
    z-index:9999;
  `;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function elementClickHandler(e) {
  if (!isInspecting || e.target.closest('[data-ignore-inspect="true"]')) return;
  e.preventDefault();
  e.stopPropagation();
  cleanupInspectMode();

  const old = document.querySelector('[data-inspect-highlighted]');
  if (old) {
    old.style.outline = '';
    old.removeAttribute('data-inspect-highlighted');
  }

  selectedElement = e.target;
  selectedElement.style.outline = '2px dashed #1e3a8a';
  selectedElement.setAttribute('data-inspect-highlighted', 'true');

  const chain = [];
  let cur = selectedElement;
  while (cur && cur !== document.body) {
    chain.push(cur);
    cur = cur.parentElement;
  }

  const vendorChecks = [
    { keyword: 'carnow', label: 'CarNow' },
    { keyword: 'cn-', label: 'CarNow' },
    { keyword: 'tp-', label: 'TradePending' },
    { keyword: 'tradepending', label: 'TradePending' },
    { keyword: 'als-', label: 'Fullpath / AutoLeadStar' },
    { keyword: 'autoleadstar', label: 'Fullpath / AutoLeadStar' },
    { keyword: 'fullpath', label: 'Fullpath / AutoLeadStar' },
    { keyword: 'autofi-', label: 'AutoFi' },
    { keyword: 'autofi-taken-over-cta', label: 'AutoFi' },
    { keyword: 'stratoslaunchbutton', label: 'Darwin' },
    { keyword: 'capitalone-', label: 'Capital One' },
    { keyword: 'edm-ico', label: 'Edmunds' },
    { keyword: 'edm-', label: 'Edmunds' },
    { keyword: 'edmunds-', label: 'Edmunds' },
    { keyword: 'prodigy-pricing', label: 'Upstart' },
    { keyword: 'prodigy-button', label: 'Upstart' },
    { keyword: 'prodigy-', label: 'Upstart' }
  ];

  const found = new Set();
  const hitKeys = [];

  for (const el of chain) {
    const cls = Array.from(el.classList).map(c => c.toLowerCase());
    const id = (el.id || '').toLowerCase();
    for (const { keyword, label } of vendorChecks) {
      const low = keyword.toLowerCase();
      if (cls.some(c => c.includes(low)) || id.includes(low)) {
        found.add(`✅ Detected: ${label} (matched "${keyword}")`);
        hitKeys.push(low);
      }
    }
  }

  if (found.size) {
    const firstLine = [...found][0];
    const match = firstLine.match(/Detected: (.*?) \(matched/i);
    const vendorName = match ? match[1] : 'Vendor';
    detectedMessage.innerHTML = `
      <div style="
        background:#d1fae5;color:#065f46;padding:6px 10px;
        margin-bottom:4px;border-left:4px solid #10b981;
        border-radius:4px;">
        ✅ 3rd-party Detected: ${vendorName}
      </div>`;

    let lines = '';
    found.forEach(line => {
      const match = line.match(/\(matched "(.*?)"\)/);
      const keyword = match ? match[1] : '';
      lines += `
        <div style="
          background:#d1fae5;color:#065f46;padding:6px 10px;
          margin-bottom:4px;border-left:4px solid #10b981;
          border-radius:4px;">
          ✅ Code match: (matched "${keyword}")
        </div>`;
    });
    lastVendorOutput = lines;
    showToast('3rd-party control detected.', true);
  } else {
    detectedMessage.innerHTML = `
      <div style="
        background:#fee2e2;color:#991b1b;padding:6px 10px;
        margin-bottom:4px;border-left:4px solid #ef4444;
        border-radius:4px;">
        ❌ No 3rd-party control detected.
      </div>`;
    lastVendorOutput = `
      <div style="
        background:#fef2f2;color:#991b1b;padding:6px 10px;
        margin-bottom:4px;border-left:4px solid #f87171;
        border-radius:4px;">
        ❌ View Raw HTML for manual review.
      </div>`;
    showToast('No 3rd-party control found.', false);
  }

  const raw = escapeHtml(selectedElement.outerHTML);
  const unique = [...new Set(hitKeys)];
  lastRawHTML = unique.length
    ? raw.replace(new RegExp(`(${unique.join('|')})`, 'gi'), `<mark style="background:#fff59d;border-radius:2px;">$1</mark>`)
    : raw;

  rawToggleBtn.disabled = false;
  rawToggleBtn.style.display = 'block';
  showRaw = false;
  rawToggleBtn.textContent = 'View Raw HTML';
  updateResultBox();
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}
});

menu.appendChild(ctaInspectorItem);


// Menu item 8: CTA Color Selector
const ctaColorSelectorItem = createMenuItem('🎨 CTA Color Selector', function() {
  // Ensure we have the right cursor and clear any previous handlers
  document.body.style.cursor = 'default';
  // Store the original state of the document
  let originalStyles = {};
  let selectedElement = null;
  let isSelecting = false;

  // Create modal for the CTA selector
  const modal = document.createElement('div');
  modal.className = 'dealeron-modal';
  modal.style.zIndex = '10001'; // Higher than other modals

  // Make the modal background non-blocking when in selection mode
  modal.style.pointerEvents = 'auto';

  const modalContent = document.createElement('div');
  modalContent.className = 'dealeron-modal-content';
  modalContent.style.width = '400px';
  modalContent.style.position = 'fixed';
  modalContent.style.top = '20px';
  modalContent.style.right = '20px';
  modalContent.style.left = 'auto';
  modalContent.style.bottom = 'auto';
  modalContent.style.maxHeight = 'calc(100vh - 40px)';
  modalContent.style.zIndex = '10002';
  modalContent.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4)';


  // Create modal header
  const modalHeader = document.createElement('div');
  modalHeader.className = 'dealeron-modal-header';
  modalHeader.style.cursor = 'move'; // Show move cursor on header

  const modalTitle = document.createElement('div');
  modalTitle.className = 'dealeron-modal-title';
  modalTitle.textContent = 'CTA Color Selector';

  const closeBtn = document.createElement('div');
  closeBtn.className = 'dealeron-modal-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
      // Stop any highlight effects
      if (selectedElement && selectedElement._pulseInterval) {
          clearInterval(selectedElement._pulseInterval);
          selectedElement._pulseInterval = null;
      }

      if (selectedElement) {
          // Clean up visuals, but keep class changes
          selectedElement.style.outline = '';
          selectedElement.style.outlineOffset = '';
          selectedElement.style.transition = '';
      }

      document.body.removeChild(modal);
      isSelecting = false;
      document.body.style.cursor = 'default';
      document.removeEventListener('click', elementClickHandler);
  });


  // Add elements to header
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeBtn);
  modalContent.appendChild(modalHeader);
  enableDrag(modalContent, modalHeader);

  // Create modal body
  const modalBody = document.createElement('div');
  modalBody.className = 'dealeron-modal-body';

  // Instructions with more details
  const instructions = document.createElement('div');
  instructions.innerHTML = `
      <p><strong>How to use:</strong></p>
      <ol style="margin-left: 20px; line-height: 1.4;">
          <li>Click "Select CTA" then click a CTA/Button on the page you want to inspect or change the style of.</li>
          <li>After selecting, choose a style from the dropdown menu</li>
          <li>See the changes applied instantly (If you are not seeing changes or not able to select a CTA it may be coming from a 3rd party. Inspect the CTA and check for classes related to 3rd party's. They may start with; cn- (CarNow), tp- (TradePending) - We may not be able to override these. Check with your team or post in GSA-Lobby to proceed.</li>
          <li>If the CTA style is approved note the style name to set in CMS > Inventory > Pricing 2.0 > PriceStak > Edit CTA > Button Style</li>
      </ol>
  `;
  instructions.style.marginBottom = '15px';
  modalBody.appendChild(instructions);

  // Selection info area
  const selectionInfo = document.createElement('div');
  selectionInfo.style.cssText = `
      background-color: #f8f9fa;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 15px;
      font-family: monospace;
      font-size: 12px;
  `;
  selectionInfo.textContent = 'No element selected. Click on a button to select it.';
  modalBody.appendChild(selectionInfo);

  // Create style selector dropdown
  const selectorContainer = document.createElement('div');
  selectorContainer.style.marginBottom = '15px';

  const selectorLabel = document.createElement('label');
  selectorLabel.textContent = 'Select Button Style:';
  selectorLabel.style.display = 'block';
  selectorLabel.style.marginBottom = '5px';
  selectorLabel.style.fontWeight = 'bold';

  const styleSelector = document.createElement('select');
  styleSelector.style.cssText = `
      width: 100%;
      padding: 8px;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      margin-bottom: 10px;
  `;

  // Add options for different button styles
  const buttonStyles = [
      { value: '', text: '-- Select a style --' },
      { value: 'btn-cta', text: 'Call To Action (btn-cta)' },
      { value: 'btn-main', text: 'Main (btn-main)' },
      { value: 'btn-alt1', text: 'Alternate 1 (btn-alt1)' },
      { value: 'btn-alt2', text: 'Alternate 2 (btn-alt2)' },
      { value: 'btn-alt3', text: 'Alternate 3 (btn-alt3)' },
      { value: 'btn-primary', text: 'Primary (btn-primary)' },
      { value: 'btn-secondary', text: 'Secondary (btn-secondary)' },
      { value: 'btn-success', text: 'Success (btn-success)' },
      { value: 'btn-warning', text: 'Warning (btn-warning)' },
      { value: 'btn-info', text: 'Info (btn-info)' },
      { value: 'btn-danger', text: 'Danger (btn-danger)' }
  ];

  buttonStyles.forEach(style => {
      const option = document.createElement('option');
      option.value = style.value;
      option.textContent = style.text;
      styleSelector.appendChild(option);
  });

// Handle style change
styleSelector.addEventListener('change', function() {
  if (!selectedElement) {
      alert('Please select a button element first');
      this.value = '';
      return;
  }

  // Get all button classes from the original class list - UPDATED to include btn-alt1, btn-alt2, btn-alt3
  const buttonClasses = ['btn-cta', 'btn-main', 'btn-alt1', 'btn-alt2', 'btn-alt3', 'btn-primary',
                        'btn-secondary', 'btn-success', 'btn-danger', 'btn-warning',
                        'btn-info', 'btn-light', 'btn-dark', 'btn-link'];

  // More direct approach: first remove all button style classes explicitly
  buttonClasses.forEach(btnClass => {
      selectedElement.classList.remove(btnClass);
  });

  // Then add the new class if selected
  if (this.value) {
      selectedElement.classList.add(this.value);
  }

  // Update the selection info
  updateSelectionInfo();
});
  selectorContainer.appendChild(selectorLabel);
  selectorContainer.appendChild(styleSelector);
  modalBody.appendChild(selectorContainer);

  // Size selector removed as requested

  // Function to update selection info
  function updateSelectionInfo() {
      if (!selectedElement) {
          selectionInfo.textContent = 'No element selected';
          return;
      }

      // Show element tag and classes
      selectionInfo.textContent = `Selected: <${selectedElement.tagName.toLowerCase()} class="${selectedElement.className}">`;
  }

  // Reset button
  const resetButton = document.createElement('button');
  resetButton.textContent = 'Reset to Original';
  resetButton.style.cssText = `
      background-color: #f0f4f8;
      color: #1e3a8a;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 8px;
      margin-right: 10px;
      cursor: pointer;
  `;
  resetButton.addEventListener('click', () => {
      if (selectedElement && selectedElement.hasAttribute('data-original-cta-class')) {
          selectedElement.className = selectedElement.getAttribute('data-original-cta-class');
          updateSelectionInfo();
          styleSelector.value = '';
      }
  });

  // New Selection button
  const newSelectionButton = document.createElement('button');
  newSelectionButton.textContent = 'Select New Element';
  newSelectionButton.style.cssText = `
      background-color: #1e3a8a;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px;
      cursor: pointer;
  `;
  newSelectionButton.addEventListener('click', () => {
      // Reset previous selection if any
      if (selectedElement && originalStyles.className) {
          selectedElement.className = originalStyles.className;
      }

      // Start new selection process
      startSelectionMode();

      // Reset the dropdowns
      styleSelector.value = '';
      sizeSelector.value = '';
  });

  // Button container
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'center';
  buttonContainer.appendChild(resetButton);
  modalBody.appendChild(buttonContainer);

  // Add a highlight effect for the currently selected element
  function highlightSelectedElement() {
      if (selectedElement) {
          // Create a pulsing outline effect
          selectedElement.style.outline = '2px solid #1e3a8a';
          selectedElement.style.outlineOffset = '2px';
          selectedElement.style.transition = 'outline-offset 0.3s ease';

          // Pulse effect
          let isPulseOut = true;
          const pulseInterval = setInterval(() => {
              if (!selectedElement) {
                  clearInterval(pulseInterval);
                  return;
              }

              if (isPulseOut) {
                  selectedElement.style.outlineOffset = '4px';
              } else {
                  selectedElement.style.outlineOffset = '2px';
              }
              isPulseOut = !isPulseOut;
          }, 800);

          // Store the interval so we can clear it when done
          selectedElement._pulseInterval = pulseInterval;
      }
  }

  // Add modal body to content
  modalContent.appendChild(modalBody);
  modal.appendChild(modalContent);

  // Start selection mode function
  function startSelectionMode() {
      // Reset previous selection if any
      if (selectedElement) {
          // Remove highlight effect
          if (selectedElement._pulseInterval) {
              clearInterval(selectedElement._pulseInterval);
              selectedElement._pulseInterval = null;
          }
          selectedElement.style.outline = '';
          selectedElement.style.outlineOffset = '';
          selectedElement.style.transition = '';

          // Restore original classes if any
          if (originalStyles.className) {
              selectedElement.className = originalStyles.className;
          }
      }

      // Reset
      selectedElement = null;
      originalStyles = {};
      isSelecting = true;

      // Update UI
      selectionInfo.textContent = 'Selecting... Click on a button element';
      document.body.style.cursor = 'crosshair';

      // Make modal background transparent to clicks
      modal.style.backgroundColor = 'transparent';
      modal.style.pointerEvents = 'none';

      // But keep modal content clickable
      modalContent.style.pointerEvents = 'auto';

      // Add global click event capture - must use capture phase to prevent navigation
      document.addEventListener('click', elementClickHandler, true);

      // Add global event listeners to prevent default behaviors
      document.addEventListener('mousedown', preventDefaultOnButtons, true);
      document.addEventListener('mouseup', preventDefaultOnButtons, true);
      document.addEventListener('touchstart', preventDefaultOnButtons, true);
      document.addEventListener('touchend', preventDefaultOnButtons, true);

      // Update modal title to show selecting state
      modalTitle.textContent = 'CTA Color Selector (Selecting...)';

      // Disable the style selector while selecting
      styleSelector.disabled = true;

      // Add a cancel button for selection mode
      const cancelSelectionBtn = document.createElement('button');
      cancelSelectionBtn.id = 'cancel-selection-btn';
      cancelSelectionBtn.textContent = 'Cancel Selection';
      cancelSelectionBtn.style.cssText = `
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 10px 20px;
          cursor: pointer;
          z-index: 10003;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      `;

      cancelSelectionBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          exitSelectionMode();
      });

      document.body.appendChild(cancelSelectionBtn);
  }

  // Function to prevent default actions on buttons while in selection mode
  function preventDefaultOnButtons(e) {
      if (!isSelecting) return;

      // Don't process events on the modal or its children
      if (e.target === modal || modalContent.contains(e.target)) {
          return;
      }

      // Allow events on cancel button
      if (e.target.id === 'cancel-selection-btn') {
          return;
      }

      // Check if it's a button or has btn class
      const isButton = e.target.tagName === 'BUTTON' ||
                      e.target.classList.contains('btn') ||
                      (e.target.tagName === 'A' && e.target.classList.contains('btn'));

      if (isButton) {
          e.preventDefault();
          e.stopPropagation();
          return false;
      }
  }

  // Function to exit selection mode without selecting anything
  function exitSelectionMode() {
      isSelecting = false;
      document.body.style.cursor = 'default';

      // Remove all event listeners
      document.removeEventListener('click', elementClickHandler, true);
      document.removeEventListener('mousedown', preventDefaultOnButtons, true);
      document.removeEventListener('mouseup', preventDefaultOnButtons, true);
      document.removeEventListener('touchstart', preventDefaultOnButtons, true);
      document.removeEventListener('touchend', preventDefaultOnButtons, true);

      // Restore modal background
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      modal.style.pointerEvents = 'auto';

      // Update UI
      modalTitle.textContent = 'CTA Color Selector';
      selectionInfo.textContent = 'No element selected. Click the button above to select.';

      // Enable the style selector
      styleSelector.disabled = false;

      // Remove cancel button if it exists
      const cancelBtn = document.getElementById('cancel-selection-btn');
      if (cancelBtn) {
          document.body.removeChild(cancelBtn);
      }
  }

  // Element click handler
  function elementClickHandler(e) {
      if (!isSelecting) return;

      // Don't process clicks on the modal or its children
      if (e.target === modal || modalContent.contains(e.target)) {
          return;
      }

      // Always prevent default during selection mode for buttons
      e.preventDefault();
      e.stopPropagation();

      // Get the clicked element
      const element = e.target;

      // Check if it's a button or has btn class
      const isButton = element.tagName === 'BUTTON' ||
                       element.classList.contains('btn') ||
                       (element.tagName === 'A' && element.classList.contains('btn'));

      if (isButton) {
          // Store the element and its original styles
          selectedElement = element;
          if (!element.hasAttribute('data-original-cta-class')) {
              element.setAttribute('data-original-cta-class', element.className);
          }
          originalStyles = {
              outline: element.style.outline,
              outlineOffset: element.style.outlineOffset,
              transition: element.style.transition
          };


          // Restore modal background
          modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
          modal.style.pointerEvents = 'auto';

          // Update UI
          isSelecting = false;
          document.body.style.cursor = 'default';
          updateSelectionInfo();

          // Remove all event listeners
          document.removeEventListener('click', elementClickHandler, true);
          document.removeEventListener('mousedown', preventDefaultOnButtons, true);
          document.removeEventListener('mouseup', preventDefaultOnButtons, true);
          document.removeEventListener('touchstart', preventDefaultOnButtons, true);
          document.removeEventListener('touchend', preventDefaultOnButtons, true);

          // Apply highlight effect
          highlightSelectedElement();

          // Set initial dropdown values based on current classes
          const currentClasses = element.className.split(' ');

          // Find button style
          buttonStyles.slice(1).forEach(style => {
              if (currentClasses.includes(style.value)) {
                  styleSelector.value = style.value;
              }
          });

          // Enable the style selector
          styleSelector.disabled = false;

          // Update modal title
          modalTitle.textContent = 'CTA Color Selector';

          // Remove cancel button if it exists
          const cancelBtn = document.getElementById('cancel-selection-btn');
          if (cancelBtn) {
              cancelBtn.parentNode.removeChild(cancelBtn);
          }
      } else {
          // Allow clicking non-button elements during selection
          // without showing an error, just continue selection mode
          return;
      }
  }

  // Add to document and show modal first
  document.body.appendChild(modal);
  modal.style.display = 'flex';
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';

  // Create a prominent "Select Button" button at the top
  const selectButtonPrompt = document.createElement('button');
  selectButtonPrompt.textContent = 'Select CTA';
  selectButtonPrompt.style.cssText = `
      background-color: #22c55e;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 12px;
      margin: 10px 0 20px 0;
      cursor: pointer;
      width: 100%;
      font-weight: bold;
      font-size: 14px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
  `;

  selectButtonPrompt.addEventListener('mouseover', () => {
      selectButtonPrompt.style.backgroundColor = '#2a4caf';
      selectButtonPrompt.style.transform = 'translateY(-2px)';
      selectButtonPrompt.style.boxShadow = '0 6px 8px rgba(0,0,0,0.15)';
  });

  selectButtonPrompt.addEventListener('mouseout', () => {
      selectButtonPrompt.style.backgroundColor = '#22c55e';
      selectButtonPrompt.style.transform = 'translateY(0)';
      selectButtonPrompt.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  });

  selectButtonPrompt.addEventListener('click', startSelectionMode);

  // Insert this button at the top of the modal body
  modalBody.insertBefore(selectButtonPrompt, modalBody.firstChild);
});
menu.appendChild(ctaColorSelectorItem);

// Menu Item 9 - Form lead type/source checker
const formLeadSourceItem = createMenuItem('📋 Form Lead Info', function () {
const leadTypes = {
  0: 'Unknown Lead', 1: 'New Car', 2: 'Used Car', 3: 'Finance/Credit',
  4: 'Customer Contact', 5: 'Service', 6: 'Parts', 7: 'Bodyshop',
  8: 'Human Resources', 9: 'General Contact', 10: 'Surveys', 11: 'Research', 12: 'Trade In'
};

const leadSources = {
  'Custom': {
    333: 'Giveaway', 332: 'Information', 330: 'Limited Time Offer',
    346: 'Oil Change', 336: 'Other 1', 337: 'Other 2',
    338: 'Other 3', 364: 'Reservation Form', 335: 'Social',
    329: 'Special Offer', 345: 'Tires'
  },
  'Website - Direct Sales': {
    396: 'Generic', 397: 'Handicapped Person', 403: 'Legal Person',
    399: 'Rental Car', 398: 'Rural Producer', 401: 'Taxi'
  },
  'Website': {
    147: 'Blog', 29: 'Chat Online', 32: 'Contact Us', 154: 'Coupon',
    149: 'Credit Card', 153: 'Custom Forms', 362: 'Custom Sales Form',
    363: 'Custom Service Form', 150: 'Specials', 155: 'Test Drive',
    2: 'Trade Page', 25: 'Used', 181: 'Value Your Trade', 22: 'New'
  },
  'Website Mobile': {
    277: 'Click to Call', 183: 'Collision Center', 237: 'Reserve Vehicle New',
    238: 'Reserve Vehicle Used', 188: 'Test Drive', 164: 'Service',
    166: 'Used', 167: 'Contact Us'
  },
  'Other': {
    30: '1HourAuto', 97: 'DealerOn', 104: 'Dealeron Sales Lead',
    36: 'E-Autobuilder', 31: 'eAutoBuyer.com', 111: 'E-AutoReports',
    1: 'E-AutoSavings', 35: 'E-AutoSavings - Peel', 141: 'ePrice-Details',
    140: 'ePrice-Inventory', 168: 'Get Auto Appraise', 143: 'Text 2 Drive',
    252: 'Vehicle request more information'
  }
};

function getLeadSourceText(sourceId) {
  for (const category in leadSources) {
    if (leadSources[category][sourceId]) {
      return `${category} - ${leadSources[category][sourceId]}`;
    }
  }
  return 'Unknown Source';
}

function detectFormOrigin(container) {
  const tag = container.tagName.toLowerCase();
  const hasLeadSource = container.querySelector('#leadSource') || container.querySelector('#leadsource');
  const hasLeadType = container.querySelector('#leadType') || container.querySelector('#leadtype');

  const isPlatformForm = (
    tag === 'form' &&
    (container.hasAttribute('data-ft-form-id') || container.hasAttribute('data-dotagging-form-name'))
  );

  if (isPlatformForm && hasLeadSource && hasLeadType) {
    return `✅ Detected: <strong>DealerOn Platform Form</strong>`;
  }

  if (container.classList.contains('dealerOnform')) {
    return `✅ Detected: <strong>Custom DealerOn Form</strong>`;
  }

  return `⚠️ Unknown Form Type – may be third-party or missing CRM attributes.`;
}

const formContainers = Array.from(document.querySelectorAll(
  '.dealerOnform, form[name="contactusForm"], form#contactusForm, form[data-ft-form-id], form[data-dotagging-form-name]'
)).filter(f => f.offsetParent !== null);

if (!formContainers.length) {
  alert('No DealerOn-style forms detected on this page.');
  return;
}

const modal = document.createElement('div');
modal.className = 'dealeron-modal';
modal.style.zIndex = '10001';
modal.setAttribute('data-ignore-inspect', 'true');

const modalContent = document.createElement('div');
modalContent.className = 'dealeron-modal-content';
modalContent.setAttribute('data-ignore-inspect', 'true');
modalContent.style.cssText = `
  width:100%;max-width:620px;position:fixed;top:20px;right:20px;
  background:#fff;border-radius:12px;box-shadow:0 20px 30px rgba(0,0,0,0.2);
  font-family:'Segoe UI',sans-serif;max-height:calc(100vh - 40px);
  overflow-y:auto;
`;

const modalHeader = document.createElement('div');
modalHeader.className = 'dealeron-modal-header';
modalHeader.style.cursor = 'move';

const modalTitle = document.createElement('div');
modalTitle.className = 'dealeron-modal-title';
modalTitle.textContent = 'Form Lead Type/Source Check';

const closeBtn = document.createElement('div');
closeBtn.innerHTML = '&times;';
closeBtn.style.cssText = `font-size:35px;font-weight:bold;cursor:pointer;color:#999;padding:0 8px;`;
closeBtn.onmouseover = () => (closeBtn.style.color = '#f87171');
closeBtn.onmouseout = () => (closeBtn.style.color = '#999');
closeBtn.onclick = () => document.body.removeChild(modal);

modalHeader.append(modalTitle, closeBtn);

const modalBody = document.createElement('div');
modalBody.style.cssText = 'padding:20px;font-size:14px;color:#1a202c;background:#f9fafb;';

const instructions = document.createElement('p');
  instructions.innerHTML = `
<strong>Select a form to review:</strong><br>
If multiple forms exist on the page, you'll see a button for each. Click to inspect the form’s Lead Type and Lead Source.
<br><br>
<em>Reminder:</em> Always double-check using your browser’s inspector or CMS. This tool is meant to assist, not replace, your normal troubleshooting process.
`;

  const skbLink = document.createElement('div');
  skbLink.innerHTML = `
<a href="https://dealeron.my.salesforce.com/lightning/articles/Knowledge/Lead-Source-Reference-Numbers"
   target="_blank"
   style="font-size:13px;color:#1e3a8a;text-decoration:underline;">
  📘 Review Lead Source/Type SKB
</a>
 `;
  skbLink.style.marginBottom = '12px';


const formList = document.createElement('div');
formList.style.cssText = 'display:flex;flex-direction:column;gap:10px;';

const resultBox = document.createElement('div');
resultBox.style.marginTop = '16px';

const detectionMessage = document.createElement('div');
detectionMessage.style.marginTop = '12px';

const rawHtmlBox = document.createElement('div');
rawHtmlBox.style.cssText = `
  margin-top:16px;padding:12px;background:#f1f5f9;
  border-left:4px solid #1e3a8a;border-radius:6px;
  font-family:monospace;font-size:12px;white-space:pre-wrap;
  display:none;overflow-x:auto;max-height:300px;
`;

const toggleRawBtn = document.createElement('button');
toggleRawBtn.textContent = 'View Raw HTML';
toggleRawBtn.style.cssText = `
  margin-top:12px;background:#fff;border:1px solid #1e3a8a;
  color:#1e3a8a;border-radius:4px;padding:8px;width:100%;
  font-weight:bold;cursor:pointer;
`;
toggleRawBtn.style.display = 'none';

const highlightStyle = '2px dashed red';
let lastHighlighted = null;
let rawVisible = false;

function escapeHtml(html, keywords = []) {
// Escape HTML characters first
let escaped = html.replace(/[&<>"']/g, (m) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]
);

keywords.forEach(keyword => {
const lowerKeyword = keyword.toLowerCase();

// Match id="leadType" or id="leadSource" with optional value="..."
const regex = new RegExp(
  `(id=&quot;${lowerKeyword}&quot;)([^>]*?value=&quot;\\d+&quot;)`,
  'gi'
);

escaped = escaped.replace(regex, (match, idPart, valuePart) => {
  return `<mark style="background:#fff59d;border-radius:3px;">${idPart} ${valuePart}</mark>`;
});

// Also catch and highlight just the ID if value= isn't found
const idAloneRegex = new RegExp(`(id=&quot;${lowerKeyword}&quot;)`, 'gi');
escaped = escaped.replace(idAloneRegex, `<mark style="background:#fff59d;border-radius:3px;">$1</mark>`);
});

return escaped;
}



formContainers.forEach((container, index) => {
  const button = document.createElement('button');
  button.textContent = `Check Form #${index + 1}`;
  button.style.cssText = `
    padding:10px;border-radius:6px;border:1px solid #ccc;
    background:#f1f5f9;cursor:pointer;font-weight:bold;
  `;
  button.addEventListener('click', () => {
    if (lastHighlighted) lastHighlighted.style.outline = '';
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    container.style.outline = highlightStyle;
    lastHighlighted = container;

    const leadType = container.querySelector('#leadType')?.value || container.querySelector('#leadtype')?.value || 'N/A';
    const leadSource = container.querySelector('#leadSource')?.value || container.querySelector('#leadsource')?.value || 'N/A';

    const leadTypeLabel = leadTypes[leadType] || 'Unknown Type';
    const leadSourceLabel = getLeadSourceText(leadSource);

    resultBox.innerHTML = `
      <div style="margin-top:12px;padding:10px;background:#fff;border-radius:6px;border:1px solid #ddd;">
        <strong>Lead Type:</strong> ${leadType} - ${leadTypeLabel}<br>
        <strong>Lead Source:</strong> ${leadSource} - ${leadSourceLabel}
      </div>
    `;

    detectionMessage.innerHTML = detectFormOrigin(container);

    rawHtmlBox.innerHTML = escapeHtml(container.outerHTML, ['leadType', 'leadtype', 'leadSource', 'leadsource']);
    toggleRawBtn.style.display = 'block';
    rawHtmlBox.style.display = 'none';
    toggleRawBtn.textContent = 'View Raw HTML';
    rawVisible = false;
  });

  formList.appendChild(button);
});

toggleRawBtn.addEventListener('click', () => {
  rawVisible = !rawVisible;
  rawHtmlBox.style.display = rawVisible ? 'block' : 'none';
  resultBox.style.display = rawVisible ? 'none' : 'block';
  detectionMessage.style.display = rawVisible ? 'none' : 'block';
  toggleRawBtn.textContent = rawVisible ? 'View Styled Results' : 'View Raw HTML';
});


modalBody.append(
instructions, skbLink, formList, resultBox,
detectionMessage, toggleRawBtn, rawHtmlBox
);

modalContent.append(modalHeader, modalBody);
modal.appendChild(modalContent);
document.body.appendChild(modal);
enableDrag(modalContent, modalHeader);
});

menu.appendChild(formLeadSourceItem);


  // Menu item 11: 📊 Tag/Script Checker
const tagCheckerItem = createMenuItem('📊 GTM / GA4 Tags', () => {
// 1) Gather all tags
const groupedResults = {
  'GTM': [],
  'GA4': []
};

// escape/highlight helpers
const escapeHTML = str => str.replace(/[&<>'"]/g, tag => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[tag]));
const highlightID = (code, id) => {
  const escId = id.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  return escapeHTML(code).replace(new RegExp(escId, 'g'),
    `<mark style="background: #bbf7d0; color: black;">${id}</mark>`);
};

// --- GTM ---
document.querySelectorAll('script[src*="googletagmanager.com"]').forEach(s => {
  const m = s.src.match(/GTM-[A-Z0-9]+/);
  if (m) groupedResults['GTM'].push({ id: m[0], code: s.outerHTML });
});

// --- GA4 ---
document.querySelectorAll('script[src*="gtag/js?id=G-"]').forEach(s => {
  const m = s.src.match(/id=(G-[A-Z0-9]+)/);
  if (m) groupedResults['GA4'].push({ id: m[1], code: s.outerHTML });
});

// Dealer ID for the TPI link
let dealerId = '00000';
const tagData = document.getElementById('dealeron_tagging_data');
if (tagData) {
  try {
    const json = JSON.parse(tagData.textContent);
    if (json.dealerId) dealerId = json.dealerId;
  } catch {}
}

// 2) Show it in a modal
const tagTypes = Object.keys(groupedResults);
const defaultType = tagTypes.find(t => groupedResults[t].length > 0) || tagTypes[0];

showModal({
  title: '📊 GTM / GA4 Tag Checker Results',
  width: '95%',
  maxWidth: '900px',
  bodyBuilder: container => {
    // Header row with note + TPI link
    const headerRow = document.createElement('div');
    headerRow.style.cssText = `
      padding:16px;
      border-bottom:1px solid #eee;
      display:flex;
      justify-content:space-between;
      align-items:flex-start;
      gap:10px;
      flex-wrap:wrap;
    `;
    const left = document.createElement('div');
    left.style.flex = '1';
    left.innerHTML = `

      <p style="margin:4px 0 0;font-size:12px;color:#6b7280;">
        Note: This tool spots GTM and GA4 tags in the source code. Manual review still recommended as some may be injected via 3rd party scripts.
      </p>
    `;
    const right = document.createElement('div');
    right.style.display = 'flex';
    right.style.gap = '8px';
    right.innerHTML = `
      <a href="https://tpi.dealeron.com/#/${dealerId}/thirdPartyIntegrations"
         target="_blank"
         style="padding:6px 10px;background-color:#3b82f6;color:white;
                border-radius:5px;text-decoration:none;font-size:14px;">
        Check TPI
      </a>
    `;
    headerRow.append(left, right);
    container.appendChild(headerRow);

    // Two-column layout
    const flex = document.createElement('div');
    flex.style.cssText = 'display:flex;flex:1;overflow:hidden;';
    // Left: list of tag types
    const list = document.createElement('div');
    list.id = 'tagTypeList';
    list.style.cssText = `
      width:200px;
      border-right:1px solid #eee;
      overflow-y:auto;
      padding:10px;
    `;
    tagTypes.forEach(type => {
      const item = document.createElement('div');
      item.className = 'tag-type';
      item.dataset.type = type;
      item.textContent = `${type} (${groupedResults[type].length})`;
      item.style.cssText = `
        cursor:pointer;
        padding:8px;
        margin-bottom:6px;
        background:${type===defaultType?'#e5e7eb':'#f9fafb'};
        border-radius:6px;
        font-weight:500;
      `;
      list.appendChild(item);
    });
    // Right: detail pane
    const detail = document.createElement('div');
    detail.id = 'tagTypeDetail';
    detail.style.cssText = 'flex:1;padding:10px;overflow-y:auto;';
    flex.append(list, detail);
    container.appendChild(flex);

    // Function to render a group
    function loadGroup(type) {
      const group = groupedResults[type];
      if (group.length) {
        detail.innerHTML = group.map(tag => `
          <div style="margin-bottom:15px;">
            <strong>${tag.id}</strong>
            <pre style="background:#f9fafb;border:1px solid #e5e7eb;
                        padding:10px;font-size:12px;
                        white-space:nowrap;overflow-x:auto;">
              <code>${highlightID(tag.code, tag.id)}</code>
            </pre>
          </div>
        `).join('');
      } else {
        detail.innerHTML = `<p>No ${type} tags found.</p>`;
      }
      document.querySelectorAll('.tag-type').forEach(el => {
        el.style.background = el.dataset.type===type?'#e5e7eb':'#f9fafb';
      });
    }

    // Init & event wiring
    loadGroup(defaultType);
    container.querySelectorAll('.tag-type').forEach(el => {
      el.addEventListener('click', () => loadGroup(el.dataset.type));
    });
  },
});
});

menu.appendChild(tagCheckerItem);

  // Menu item 11: DNS Lookup
function createSection(title, contentEl, status = null) {
const section = document.createElement('div');
Object.assign(section.style, { border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden' });

const header = document.createElement('div');
Object.assign(header.style, {
  backgroundColor: '#f8f9fa', padding: '10px 15px',
  fontWeight: 'bold', borderBottom: '1px solid #e2e8f0',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
});
header.textContent = title;

if (status) {
  const ind = document.createElement('span');
  ind.textContent = status === 'good' ? '✓' : status === 'warning' ? '⚠️' : '✗';
  ind.style.color = status === 'good' ? 'green' : status === 'warning' ? 'orange' : 'red';
  header.appendChild(ind);
}

const body = document.createElement('div');
Object.assign(body.style, { padding: '15px', backgroundColor: 'white' });
if (typeof contentEl === 'string') body.textContent = contentEl;
else body.appendChild(contentEl);

section.appendChild(header);
section.appendChild(body);
return section;
}

function isDealerOnNameserver(ns) {
  const domains = [
    'dns1.dealeron.com',
    'dns2.dealeron.com',
    'ns-761.awsdns-31.net',
    'ns-204.awsdns-25.com',
    'ns-1716.awsdns-22.co.uk',
    'ns-1306.awsdns-35.org'
  ];
  return domains.some(d => ns.toLowerCase().includes(d));
}

// 3) The refactored DNS Lookup menu item
const dnsLookupItem = createMenuItem('📡 DNS Lookup', () => {
const fullDomain = window.location.hostname;
const parts = fullDomain.split('.');
const rootDomain = (parts.length > 2 && parts[0]==='www')
  ? parts.slice(1).join('.') : fullDomain;

showModal({
  title: `Domain Analysis for ${rootDomain}`,
  bodyBuilder: container => {
    // Loading indicator
    const loading = document.createElement('div');
    loading.textContent = 'Loading domain information…';
    loading.style.margin = '20px 0'; loading.style.textAlign = 'center';
    container.appendChild(loading);

    // Prepare results wrapper
    const results = document.createElement('div');
    Object.assign(results.style, {
      display: 'flex', flexDirection: 'column', gap: '15px'
    });

    // Fetch NS records
    fetch(`https://dns.google/resolve?name=${rootDomain}&type=NS`)
      .then(r => r.json())
      .then(nsData => {
        container.removeChild(loading);

        let nsRecords = [];
        if (nsData.Answer) {
          nsRecords = nsData.Answer.filter(r => r.type===2).map(r => r.data);
        }

        const listEl = document.createElement('ul');
        Object.assign(listEl.style, { margin: 0, padding: '0 0 0 20px' });
        if (nsRecords.length) {
          nsRecords.forEach(ns => {
            const li = document.createElement('li');
            li.textContent = ns;
            listEl.appendChild(li);
          });
        } else {
          const li = document.createElement('li');
          li.textContent = 'No NS records found';
          listEl.appendChild(li);
        }

        const dealerOnCount = nsRecords.filter(isDealerOnNameserver).length;
        const status = (dealerOnCount===nsRecords.length && nsRecords.length>0)
          ? 'good'
          : (dealerOnCount>0 ? 'warning' : 'bad');

        const messages = {
            good:    'All nameservers are pointing to DealerOn. We can manage DNS here. Reach out to the IT lobby to confirm and reference the WHOIS Lookup link below.',
            warning: 'Some nameservers point to DealerOn, but not all. DNS changes may not fully propagate. Reach out to the IT lobby to confirm and reference the WHOIS Lookup link below.',
            bad:     'Nameservers do not point to DealerOn. We cannot manage DNS for this domain.'
        };

        const statusMsg = document.createElement('p');
        statusMsg.textContent = messages[status];
        statusMsg.style.marginTop = '10px';
        statusMsg.style.fontWeight = status==='good' ? 'normal' : 'bold';
        statusMsg.style.color = status==='good' ? 'green' : status==='warning' ? 'orange' : 'red';

        // Add the NS section
        const section = createSection('Nameservers (NS Records)', (() => {
          const frag = document.createDocumentFragment();
          frag.appendChild(listEl);
          frag.appendChild(statusMsg);
          return frag;
        })(), status);
        results.appendChild(section);

        // Note if we used “www.”
        if (rootDomain !== fullDomain) {
          const note = document.createElement('p');
          note.textContent = `Note: Ran on "${rootDomain}" (stripped "www." from "${fullDomain}").`;
          note.style.fontSize = '14px';
          results.appendChild(note);
        }

        // WHOIS button
        const whois = document.createElement('button');
        whois.textContent = 'Open WHOIS Lookup';
        Object.assign(whois.style, {
          backgroundColor: '#f8f9fa', color: '#1e3a8a',
          border: '1px solid #e2e8f0', borderRadius: '4px',
          padding: '10px', cursor: 'pointer', width: '100%',
          transition: 'all 0.2s ease', marginTop: '10px'
        });
        whois.addEventListener('mouseover', () => {
          whois.style.backgroundColor = '#e2e8f0';
          whois.style.transform = 'translateY(-1px)';
          whois.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
        whois.addEventListener('mouseout', () => {
          whois.style.backgroundColor = '#f8f9fa';
          whois.style.transform = 'translateY(0)';
          whois.style.boxShadow = 'none';
        });
        whois.addEventListener('click', () => {
          window.open(`https://www.whois.com/whois/${rootDomain}`, '_blank');
        });
        results.appendChild(whois);

        container.appendChild(results);
      })
      .catch(err => {
        container.removeChild(loading);
        const errDiv = document.createElement('div');
        errDiv.textContent = `Error: ${err.message}`;
        errDiv.style.color = 'red';
        errDiv.style.margin = '20px 0';
        container.appendChild(errDiv);
      });
  },
});
});
menu.appendChild(dnsLookupItem);


  // Menu item 12: Can This Page Be iFramed?
const iframeCheckItem = createMenuItem('👁️ iFrame Checker', () => {
const currentUrl = window.location.href;

showModal({
  title: 'iFrame Compatibility Check',
  width: 'auto',
  maxWidth: '900px',
  bodyBuilder: container => {
    // Instructions
    const instructions = document.createElement('div');
    instructions.style.cssText = `
      margin: 10px 0 20px 0;
      font-size: 14px;
      line-height: 1.5;
    `;
    instructions.innerHTML = `
      <p>To check if this page can be iFramed:</p>
      <ol>
        <li>Copy this URL: <strong>${currentUrl}</strong></li>
        <li>Paste it in the URL field in the checker below</li>
        <li>Click "Check" button</li>
      </ol>
    `;
    container.appendChild(instructions);

    // URL + Copy button
    const urlContainer = document.createElement('div');
    urlContainer.style.cssText = `
      display: flex;
      margin: 10px 0 20px 0;
      gap: 10px;
    `;
    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.value = currentUrl;
    urlInput.readOnly = true;
    urlInput.style.cssText = `
      flex-grow: 1;
      padding: 8px;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      font-family: monospace;
      font-size: 14px;
    `;
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy URL';
    copyBtn.style.cssText = `
      background-color: #1e3a8a;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0 15px;
      cursor: pointer;
    `;
    copyBtn.addEventListener('click', () => {
      urlInput.select();
      document.execCommand('copy');
      copyBtn.textContent = 'Copied!';
      setTimeout(() => copyBtn.textContent = 'Copy URL', 2000);
    });
    urlContainer.appendChild(urlInput);
    urlContainer.appendChild(copyBtn);
    container.appendChild(urlContainer);

    // Loading indicator
    const loadingMsg = document.createElement('div');
    loadingMsg.textContent = 'Loading iFrame checker…';
    loadingMsg.style.cssText = `
      text-align: center;
      padding: 20px;
    `;
    container.appendChild(loadingMsg);

    // The checker iframe
    const checkFrame = document.createElement('iframe');
    checkFrame.style.cssText = `
      width: 100%;
      height: 350px;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      margin: 20px 0;
      display: none;
    `;
    checkFrame.src = 'https://www.tinywebgallery.com/check_iframe.php';
    checkFrame.onload = () => {
      loadingMsg.style.display = 'none';
      checkFrame.style.display = 'block';
    };
    container.appendChild(checkFrame);

    // “Open full checker” button
    const openFull = document.createElement('button');
    openFull.textContent = 'Open Full iFrame Checker in New Window';
    openFull.style.cssText = `
      background-color: #f0f4f8;
      color: #1e3a8a;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 10px;
      cursor: pointer;
      width: 100%;
      margin-top: 10px;
    `;
    openFull.addEventListener('click', () => {
      window.open(
        'https://www.tinywebgallery.com/blog/advanced-iframe/free-iFrame-checker',
        '_blank'
      );
    });
    container.appendChild(openFull);
  },
});
});

menu.appendChild(iframeCheckItem);

// Menu item 13: HTML Templates (parent menu)
const htmlTemplatesItem = createMenuItem('📝 HTML Templates', null, true);
menu.appendChild(htmlTemplatesItem);

// Create HTML Templates submenu
const htmlTemplatesSubmenu = createSubmenu(htmlTemplatesItem, menu);

// Make Basic Buttons a parent menu item with submenu
const buttonsItem = createMenuItem('Basic Buttons', null, true);
htmlTemplatesSubmenu.appendChild(buttonsItem);

// Create Basic Buttons submenu
const buttonsSubmenu = createSubmenu(buttonsItem, htmlTemplatesSubmenu);

// Add items for each button size
const largeButtonItem = createMenuItem('Large Button', function() {
  const buttonCode = `<a class="btn btn-cta btn-lg" href=" ADD URL/LINK HERE ">Large Button</a>`;
  const buttonModal = createModal(
      'Large Button Example',
      buttonCode
  );
  buttonModal.style.display = 'flex';
  addCopyButton(buttonModal, buttonCode);
});
buttonsSubmenu.appendChild(largeButtonItem);

const smallButtonItem = createMenuItem('Small Button', function() {
  const buttonCode = `<a class="btn btn-cta btn-sm" href=" ADD URL/LINK HERE ">Small Button</a>`;
  const buttonModal = createModal(
      'Small Button Example',
      buttonCode
  );
  buttonModal.style.display = 'flex';
  addCopyButton(buttonModal, buttonCode);
});
buttonsSubmenu.appendChild(smallButtonItem);

const extraSmallButtonItem = createMenuItem('Extra Small Button', function() {
  const buttonCode = `<a class="btn btn-cta btn-xs" href=" ADD URL/LINK HERE ">Extra Small Button</a>`;
  const buttonModal = createModal(
      'Extra Small Button Example',
      buttonCode
  );
  buttonModal.style.display = 'flex';
  addCopyButton(buttonModal, buttonCode);
});
buttonsSubmenu.appendChild(extraSmallButtonItem);

// Function to add the copy button to modal
function addCopyButton(modal, content) {
  const copyButton = document.createElement('button');
  copyButton.textContent = 'Copy Code';
  copyButton.style.marginTop = '10px';
  copyButton.style.padding = '5px 10px';

  // Copy the content to the clipboard when the copy button is clicked
  copyButton.addEventListener('click', function() {
      navigator.clipboard.writeText(content).then(() => {
          alert('Code copied to clipboard!');
      }).catch(err => {
          alert('Failed to copy: ', err);
      });
  });

  // Append the copy button at the bottom of the modal
  modal.appendChild(copyButton);
}

// Add Responsive Image item
const responsiveImageItem = createMenuItem('Responsive Image', function() {
  const imageCode = `<img src="#MISCPATH#DB-No-SSN-Button__4___1_.png" alt=" ALT HERE  " class="img-responsive">`;
  const imageModal = createModal(
      'Responsive Image',
      imageCode
  );
  imageModal.style.display = 'flex';
  addCopyButton(imageModal, imageCode);
});
htmlTemplatesSubmenu.appendChild(responsiveImageItem);

// Add Responsive Image with Link item
const responsiveImageWithLinkItem = createMenuItem('Image with Link', function() {
  const imageWithLinkCode = `<a href=" enter link here "><img src="#MISCPATH#DB-No-SSN-Button__4___1_.png" alt=" enter alt text here " class="img-responsive"></a>`;
  const imageWithLinkModal = createModal(
      'Responsive Image with Link',
      imageWithLinkCode
  );
  imageWithLinkModal.style.display = 'flex';
  addCopyButton(imageWithLinkModal, imageWithLinkCode);
});
htmlTemplatesSubmenu.appendChild(responsiveImageWithLinkItem);

// Add Basic iFrame item
const basicIframeItem = createMenuItem('Basic iFrame', function() {
  const iframeCode = `<iframe width="560" height="315" src="ADD URL/LINK HERE"></iframe>`;
  const iframeModal = createModal(
      'Basic iFrame - Note: You can adjust the height and width as desired',
      iframeCode
  );
  iframeModal.style.display = 'flex';
  addCopyButton(iframeModal, iframeCode);
});
htmlTemplatesSubmenu.appendChild(basicIframeItem);

// Add Slim (Pencil) Banner item
const slimBannerItem = createMenuItem('Slim (Pencil) Banner', function() {
  const bannerTemplate = `<a href="/myLink.html" class="btn btn-cta btn-lg btn-block pad-vert-5x text-center">
<div class="container">
  <div class="row">
    <div class="col-xs-12">
      <h2 class="h3 margin-x">
        Link Heading
      </h2>
    </div>
  </div>
</div>
</a>`;
  const bannerModal = createModal(
      'Slim (Pencil) Banner Template',
      bannerTemplate
  );
  bannerModal.style.display = 'flex';
  addCopyButton(bannerModal, bannerTemplate);
});
htmlTemplatesSubmenu.appendChild(slimBannerItem);

// Add Text with CTA item
const textWithCTAItem = createMenuItem('Text with CTA', function() {
  const ctaTemplate = `<div class="pad-vert-1x bg-main border-x text-center">
<div class="container">
  <div class="col-sm-12">
    <ul class="list-inline vert-middle">
      <li class="h1"> Text Here </li>
      <li> <a href="/myLink.html" class="btn btn-cta btn-lg">Click Here Now!</a></li>
    </ul>
  </div>
</div>
</div>`;
  const ctaModal = createModal(
      'Text with CTA Template',
      ctaTemplate
  );
  ctaModal.style.display = 'flex';
  addCopyButton(ctaModal, ctaTemplate);
});
htmlTemplatesSubmenu.appendChild(textWithCTAItem);

// Add Rotating Banner item
const rotatingBannerItem = createMenuItem('Rotating Banner', function() {
const bannerCode = `<div id="carousel-example-generic" class="carousel slide" data-ride="carousel"><ol class="carousel-indicators"><li data-slide-to="0" class="active"></li><li data-slide-to="1"></li><li data-slide-to="2"></li></ol><div class="carousel-inner"><div class="item active"><a href="linkhere"><img src="..." alt=""></a></div><div class="item"><a href="linkhere"><img src="..." alt=""></a></div><div class="item"><a href="linkhere"><img src="..." alt=""></a></div></div><a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev"><i class="fa fa-chevron-left"></i></a><a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next"><i class="fa fa-chevron-right"></i></a></div>`;
const bannerModal = createModal(
  'Rotating Banner',
  bannerCode.trim()
);
bannerModal.style.display = 'flex';
addCopyButton(bannerModal, bannerCode.trim());
});
htmlTemplatesSubmenu.appendChild(rotatingBannerItem);


// Menu item 16: Cache Tools
 if (
  window.location.hostname === 'cms.dealeron.com' &&
  window.location.search.includes('tmResetCache=1')
) {
  let hasClicked = false;
  const poll = setInterval(() => {
    if (hasClicked) {
      clearInterval(poll);
      return;
    }
    const btn = document.querySelector('button#resetCache');
    if (btn) {
      hasClicked = true;
      clearInterval(poll);
      btn.click();

      // remove our flag so SPA navigations won’t re-trigger
      history.replaceState(null, '', location.pathname + location.hash);

      // ── Extract dealer ID from the URL hash ──
      const hashMatch = location.hash.match(/#\/(\d+)\//);
      const dealerId = hashMatch ? hashMatch[1] : 'Unknown ID';

      // ── Show a centered, prominent banner with only the ID ──
      const banner = document.createElement('div');
      Object.assign(banner.style, {
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        padding: '50px 60px',
        background: '#4caf50', color: '#fff',
        textAlign: 'center', fontSize: '1.5rem',
        fontWeight: 'bold',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
        zIndex: 9999
      });
      banner.textContent = `✅ Cache reset for Dealer ID: ${dealerId}`;
      document.body.appendChild(banner);

      // ── Close the popup after 2 seconds ──
      setTimeout(() => window.close(), 3000);
    }
  }, 300);
}


function getDealerId() {
  // 1) Global var (when available)
  if (typeof window.DlronGlobal_DealerId !== 'undefined' && window.DlronGlobal_DealerId) {
    return String(window.DlronGlobal_DealerId);
  }

  // 2) JSON in the tagging-data script (covers 404s and other pages)
  const scriptTag = document.getElementById('dealeron_tagging_data');
  if (scriptTag) {
    try {
      const data = JSON.parse(scriptTag.textContent || scriptTag.innerText);
      if (data.dealerId) {
        return String(data.dealerId);
      }
    } catch (e) {
      // invalid JSON? ignore
    }
  }

  // 3) URL‐hash fallback (for CMS pages or other SPA routes)
  const hashMatch = window.location.hash.match(/#\/(\d+)\//);
  if (hashMatch) {
    return hashMatch[1];
  }

  // 4) Hostname fallback (e.g. dealer12345.dealeron.com)
  const hostMatch = window.location.hostname.match(/dealer(\d+)\.dealeron\.com/i);
  if (hostMatch) {
    return hostMatch[1];
  }

  // not found
  return null;
}


// reload current page with cache-busting param
function cachelessReload() {
  const url = new URL(window.location.href);
  url.search = '';
  const cacheBuster = String(Math.floor(1 + Math.random() * 9999)).padStart(4, '0');
  url.searchParams.set('no-cache', cacheBuster);
  window.location.href = url.toString();
}

// open the CMS reset-cache popup, centered
function openCmsResetPopup() {
  const dealerId = getDealerId();
  if (!dealerId) {
    return alert('⚠️ Could not determine Dealer ID.');
  }
  const url =
    `https://cms.dealeron.com/dash/dist/cms/` +
    `?tmResetCache=1#/${dealerId}/siteContent`;
  const w = 800, h = 600;
  const left  = Math.round((screen.availWidth  - w) / 2);
  const top   = Math.round((screen.availHeight - h) / 2);
  window.open(
    url,
    'tmResetCache',
    `width=${w},height=${h},left=${left},top=${top},` +
    `resizable=yes,scrollbars=yes`
  );
}
// ────────────────────────────────────────────────────────────────
// MENU-BUILDING (inside your existing builder block)
// ────────────────────────────────────────────────────────────────

// 1) Parent entry for Cache Tools (third arg = true ⇒ dropdown)
const cacheToolsItem = createMenuItem('‼️ Cache Tools', null, true);
menu.appendChild(cacheToolsItem);

// 2) Create its submenu container
const cacheToolsSubmenu = createSubmenu(cacheToolsItem, menu);

// 3) “Reload Page” submenu entry
const reloadPageItem = createMenuItem('Reload Page', () => {
  cachelessReload();
});
cacheToolsSubmenu.appendChild(reloadPageItem);

// 4) “Reset CMS Cache” submenu entry
const resetCmsCacheItem = createMenuItem('Reset CMS Cache', () => {
  openCmsResetPopup();
});
cacheToolsSubmenu.appendChild(resetCmsCacheItem);




  // Add elements to the page
  document.body.appendChild(floatingButton);
  document.body.appendChild(sideTab);
  document.body.appendChild(menu);

  // Track menu state
  let isMenuVisible = false;

  // Side tab click event - show the main button and menu simultaneously
  sideTab.addEventListener('click', function() {
      console.log('Side tab clicked, showing menu and logo');

      // Hide the side tab
      this.style.display = 'none';

      // Show the main button
      floatingButton.style.display = 'block';
      floatingButton.classList.add('show');

      // IMPORTANT: Open the menu immediately
      setTimeout(() => {
          menu.style.display = 'flex';
          isMenuVisible = true;
          console.log('Menu should be visible now:', menu.style.display);
      }, 10);
  });

  // Toggle menu visibility when clicking the main button
  floatingButton.addEventListener('click', () => {
      // Toggle menu visibility
      if (isMenuVisible) {
          // Hide the menu
          menu.style.display = 'none';
          isMenuVisible = false;
          floatingButton.classList.remove('active');

          // Hide all submenus
          document.querySelectorAll('.dealeron-submenu').forEach(submenu => {
              submenu.style.maxHeight = '0';
              submenu.style.paddingTop = '0';
              submenu.style.paddingBottom = '0';

          });

          // Hide the main button and show the side tab
          floatingButton.style.display = 'none';
          floatingButton.classList.remove('show');
          sideTab.style.display = 'flex';
      } else {
          // Show the menu
          menu.style.display = 'flex';
          isMenuVisible = true;
          floatingButton.classList.add('active');
      }
  });

  // Close menu when clicking elsewhere on the page, but keep the main button visible
  document.addEventListener('click', (event) => {
      if (!menu.contains(event.target) &&
          event.target !== floatingButton &&
          !event.target.closest('.dealeron-submenu') &&
          !event.target.closest('.dealeron-modal') &&
          isMenuVisible) {
          isMenuVisible = false;
          menu.style.display = 'none';
          floatingButton.classList.remove('active');

          // Keep the main button visible
          floatingButton.style.display = 'block';
          floatingButton.classList.add('show');

          // Hide all submenus
          document.querySelectorAll('.dealeron-submenu').forEach(submenu => {
              submenu.style.maxHeight = '0';
              submenu.style.paddingTop = '0';
              submenu.style.paddingBottom = '0';

          });
      }
  });

  // Set initial states - start with side tab visible and button hidden
  floatingButton.style.display = 'none'; // Hide the button initially
  sideTab.style.display = 'flex'; // Start with the side tab visible
})();

