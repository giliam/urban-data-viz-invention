import pandas as pd

parameters = [
    "area",
    "coeff_emprise_sol",
    "coeff_occu_sol",
    "aire_vegetalisee_pourc",
    "pourc_aire_route",
    "n_parcelles",
    "ecole",
    "collegelycee",
    "som_refroid_arbres",
    "som_impermeabilite",
    "aire_moyenne_ilots",
    "avg_hauteur",
    "avg_width",
    "avg_height",
    "prop_bati_tertiaire",
    "prop_perio_constr_generale_better",
    "prop_perio_constr_avant_1919",
    "prop_perio_constr_1971_1990",
    "prop_perio_constr_1946_1970",
    "rp_cccoll_sur_resprin",
    "rp_garl_sur_menages",
    "rp_voit1p_sur_menages",
    "rp_voit1p_sur_menages",
    "population",
    "prop_bati_residentiel",
    "prop_bati_industriel",
]

df = pd.read_csv("../src/input/description_parametres_en.csv", index_col="name_param")

df_ = df.loc[parameters, "description_fr"]
df_.to_csv("data.csv")