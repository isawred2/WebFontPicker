var PickerView = Backbone.View.extend({

    template: WFP.Templates.Picker,

    initialize: function() {

        // Options
        this.hideAfter = 2500;  // How long to wait (in milliseconds) before the picker is hidden.
        this.visibleLimit = 15; // How much (in px) of the element is visible horizontally when hidden to the side.

        // Constructing an element from the template
        var element = elementFromHTML(this.template());
        this.setElement(element);

        // Caching selectors
        this.$list = this.$('#font-picker-list');
        this.$add  = this.$('.add-style');

        // Attaching events
        this.listenTo(Styles, 'add', this.add);
        this.listenTo(Styles, 'remove', this._onModelRemove); 
        this.attachEvents();
    },

    attachEvents: function() {

        var picker = this;

        this.$el.on({
            mouseenter: function() {
                picker.mouseOver = true;
                picker.$el.off('blur', picker.hide, true);
                picker.show();
            },
            mouseleave: function() {
                picker.mouseOver = false;
                if (!document.activeElement || !jQuery.contains(picker.el, document.activeElement)) {
                    picker.hide();
                }
            },
            focusin: function() {
                picker.show();
            },
            focusout: function() {
                if (!picker.mouseOver) picker.hide();
            }
        });

        this.$add.on('click', Styles.addNew);
    },

    // Creates a new view with the model passed and appends it to the list.
    add: function(model) {
        var view = new StyleView({ model: model });
        this.$list.append(view.el);
        
        _.defer(function() {
            view.$selector.focus();
        });
    },

    // Slides the picker out horizontally. 
    // If `px` (Number) is passed, only `px` pixels is slid out.
    slideOut: function(px) {
        var x = (!isNaN(px)) ? this.el.offsetWidth - px : 0;
        this.$el.css('transform', 'translate3d(' + x + 'px, 0, 0)');
    },

    // Hides the picker after the specified waiting time.
    hide: function() {
        var picker = this;
        if (!this.hideTimeout) {
            this.hideTimeout = setTimeout(function() {
                picker.slideOut(picker.visibleLimit);
            }, this.hideAfter);
        }
    },

    // Shows the picker instantly.
    show: function() {
        clearTimeout(this.hideTimeout);
        this.hideTimeout = null;
        this.slideOut();
    }

});