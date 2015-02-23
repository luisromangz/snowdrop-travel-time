(function() {

    function JLLOverlay(_options) {

        this.options = _options || {};

        this.id = this.options.id || 'overlay';

        this.overlayParent = null;
        if (typeof this.options.parent === 'string') {
            this.overlayParent = document.getElementById('map');
        } else if (typeof this.options.parent === 'object') {
            this.overlayParent = this.options.parent;
        }

        //create the overlay
        this._createOverlay();
        this._setOverlayCover();
        this._setOverlayModal();

        this.overlayParent.appendChild(this.overlay);
        this._binding();
    }

    JLLOverlay.prototype._createOverlay = function() {
        this.overlay = document.createElement('div');
        this.overlay.className = this.id;
    };

    JLLOverlay.prototype._setOverlayCover = function() {
        var cover = document.createElement('div');
        cover.className = this.id + '-cover';
        this.overlay.appendChild(cover);
    };

    JLLOverlay.prototype._setOverlayModal = function() {
        var modal = document.createElement('div');
        modal.innerHTML = '<span class="' + this.id + '-close-btn"></span>';
        modal.className = this.id + '-modal';


        if (this.options.modalClasses && typeof this.options.modalClasses === 'string') {
            modal.className += ' ' + this.options.modalClasses;
        }
        if (this.options.modalInnerContent && typeof this.options.modalInnerContent === 'string') {
            modal.innerHTML += '<div class="' + this.id + '-modal-inner">' + this.options.modalInnerContent + '</div>';
        }

        this.overlay.appendChild(modal);
    };

    JLLOverlay.prototype._binding = function() {
        var that = this;
        document.getElementsByClassName(this.id + '-close-btn')[0].onclick = function() {
            that.destroy();
        };

        if (this.options.scripts && typeof this.options.scripts === 'function') {
            this.options.scripts();
        }
    };

    JLLOverlay.prototype.destroy = function() {
        this.overlayParent.removeChild(this.overlay);
    };

    if (typeof window.JLLOverlay == 'undefined') {
        window.JLLOverlay = JLLOverlay;
    }
})();